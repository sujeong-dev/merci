'use client';

import { useState, useRef, useCallback } from 'react';
import { getPresignedUrl, uploadToPresignedUrl, updateMemory } from '@/shared/api';
import type { MemoryResponse } from '@/shared/api';

export type RecordingState = 'idle' | 'recording' | 'done';

/** 음성 MIME 타입 자동 감지 */
function getSupportedMimeType(): string {
  const types = ['audio/webm', 'audio/mp4', 'audio/mpeg'];
  return types.find((t) => MediaRecorder.isTypeSupported(t)) ?? 'audio/webm';
}

/** MM:SS 형식으로 초를 변환 */
export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

const MAX_RECORDING_SECONDS = 300;

interface UseMemoryEditOptions {
  memory: MemoryResponse;
  onSuccess: () => void;
}

export function useMemoryEdit({ memory, onSuccess }: UseMemoryEditOptions) {
  // 폼 필드 — 기존 데이터로 초기화
  const [title, setTitle] = useState(memory.title);
  const [year, setYear] = useState(String(memory.year));
  const [location, setLocation] = useState(memory.location);
  const [people, setPeople] = useState(memory.people);
  const [story, setStory] = useState(memory.story);

  // 이미지 — 변경 시만 업로드 (null이면 기존 유지)
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(memory.image_url);

  // 음성 — null이면 기존 유지, 'delete'면 삭제
  type VoiceState = 'keep' | 'record' | 'delete';
  const [voiceState, setVoiceState] = useState<VoiceState>(
    memory.voice_url ? 'keep' : 'record',
  );
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [voiceBlob, setVoiceBlob] = useState<Blob | null>(null);
  const [voiceDuration, setVoiceDuration] = useState(0);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // 제출
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // ── 이미지 선택 ─────────────────────────────────────────────
  const handleImageSelect = useCallback((file: File) => {
    setImageFile(file);
    setImagePreviewUrl(URL.createObjectURL(file));
  }, []);

  // ── 기존 음성 삭제 ────────────────────────────────────────
  const handleDeleteExistingVoice = useCallback(() => {
    setVoiceState('record');
    setRecordingState('idle');
  }, []);

  // ── 녹음 시작 ─────────────────────────────────────────────
  const handleStartRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = getSupportedMimeType();
      const mediaRecorder = new MediaRecorder(stream, { mimeType });

      chunksRef.current = [];
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        const elapsed = Math.round((Date.now() - startTimeRef.current) / 1000);
        setVoiceBlob(blob);
        setVoiceDuration(elapsed);
        setRecordingState('done');
        stream.getTracks().forEach((t) => t.stop());
      };

      startTimeRef.current = Date.now();
      setRecordingSeconds(0);
      setRecordingState('recording');
      mediaRecorder.start(100);

      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => {
          const next = prev + 1;
          if (next >= MAX_RECORDING_SECONDS) handleStopRecording();
          return next;
        });
      }, 1000);
    } catch (err) {
      if (err instanceof DOMException && err.name === 'NotAllowedError') {
        alert('마이크 접근 권한이 필요합니다.');
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleStopRecording = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    if (mediaRecorderRef.current?.state === 'recording') mediaRecorderRef.current.stop();
  }, []);

  const handleTogglePlayVoice = useCallback(() => {
    if (!voiceBlob) return;
    if (!audioRef.current) {
      const audio = new Audio(URL.createObjectURL(voiceBlob));
      audio.onended = () => setIsPlaying(false);
      audioRef.current = audio;
    }
    if (isPlaying) { audioRef.current.pause(); setIsPlaying(false); }
    else { audioRef.current.play(); setIsPlaying(true); }
  }, [voiceBlob, isPlaying]);

  const handleDeleteVoice = useCallback(() => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    setVoiceBlob(null);
    setVoiceDuration(0);
    setRecordingSeconds(0);
    setIsPlaying(false);
    setRecordingState('idle');
    // 기존 음성이 있었다면 완전 삭제 의사 표시
    setVoiceState('delete');
  }, []);

  // ── 제출 ──────────────────────────────────────────────────
  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);
    setSubmitError('');

    try {
      // 이미지 업로드 (변경 시만)
      let imageKey: string | undefined;
      if (imageFile) {
        const presigned = await getPresignedUrl('image', imageFile.type);
        await uploadToPresignedUrl(presigned.upload_url, imageFile, imageFile.type);
        imageKey = presigned.object_key;
      }

      // 음성 처리
      let voiceKey: string | undefined | null;
      if (voiceBlob && voiceState === 'record') {
        const mimeType = voiceBlob.type || getSupportedMimeType();
        const presigned = await getPresignedUrl('voice', mimeType);
        await uploadToPresignedUrl(presigned.upload_url, voiceBlob, mimeType);
        voiceKey = presigned.object_key;
      } else if (voiceState === 'delete') {
        voiceKey = ''; // 서버에서 빈 문자열 = 삭제
      }

      await updateMemory(memory.id, {
        title,
        year: Number(year),
        location,
        people,
        story,
        ...(imageKey ? { image_key: imageKey } : {}),
        ...(voiceKey !== undefined ? { voice_key: voiceKey } : {}),
      });

      onSuccess();
    } catch {
      setSubmitError('저장에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setIsSubmitting(false);
    }
  }, [imageFile, voiceBlob, voiceState, title, year, location, people, story, memory.id, onSuccess]);

  const isValid = title.trim() !== '' && year !== '' && location.trim() !== '' && people.trim() !== '' && story.trim() !== '';

  return {
    title, setTitle,
    year, setYear,
    location, setLocation,
    people, setPeople,
    story, setStory,
    imageFile, imagePreviewUrl, handleImageSelect,
    voiceState, recordingState, voiceBlob, voiceDuration, recordingSeconds,
    isPlaying, handleStartRecording, handleStopRecording,
    handleTogglePlayVoice, handleDeleteVoice, handleDeleteExistingVoice,
    isSubmitting, submitError, isValid, handleSubmit,
    existingVoiceUrl: memory.voice_url,
  };
}
