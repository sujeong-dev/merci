'use client';

import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getPresignedUrl, uploadToPresignedUrl, createMemory } from '@/shared/api';

export type RecordingState = 'idle' | 'recording' | 'done';

/** 음성 MIME 타입 자동 감지 (iOS Safari: audio/mp4, 그 외: audio/webm) */
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

// 최대 녹음 시간 (5분)
const MAX_RECORDING_SECONDS = 300;

export function usePhotoUpload() {
  const router = useRouter();

  // 폼 필드
  const [title, setTitle] = useState('');
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [location, setLocation] = useState('');
  const [people, setPeople] = useState('');
  const [story, setStory] = useState('');

  // 사진
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);

  // 음성 녹음
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [voiceBlob, setVoiceBlob] = useState<Blob | null>(null);
  const [voiceDuration, setVoiceDuration] = useState(0);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // 제출
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // 녹음 내부 refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // ── 사진 선택 ─────────────────────────────────────────────────
  const handleImageSelect = useCallback((files: FileList | File[]) => {
    const newFiles = Array.from(files);
    
    // 이전 로직: 단일 파일
    // setImageFile(file);
    // setImagePreviewUrl(URL.createObjectURL(file));

    // 새 로직: 다중 파일 (최대 10개)
    setImageFiles((prev) => {
      const combined = [...prev, ...newFiles];
      return combined.slice(0, 10);
    });
    setImagePreviewUrls((prev) => {
      const newUrls = newFiles.map((f) => URL.createObjectURL(f));
      const combined = [...prev, ...newUrls];
      return combined.slice(0, 10);
    });
  }, []);

  const handleRemoveImage = useCallback((index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviewUrls((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      // URL.revokeObjectURL 은 메모리 해제를 위해 필요하지만 여기선 생략할 수도 있음
      return updated;
    });
  }, []);

  // ── 녹음 시작 ─────────────────────────────────────────────────
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
        // 스트림 트랙 종료
        stream.getTracks().forEach((t) => t.stop());
      };

      startTimeRef.current = Date.now();
      setRecordingSeconds(0);
      setRecordingState('recording');
      mediaRecorder.start(100);

      // 1초마다 타이머 증가, 최대 시간 도달 시 자동 정지
      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => {
          const next = prev + 1;
          if (next >= MAX_RECORDING_SECONDS) {
            handleStopRecording();
          }
          return next;
        });
      }, 1000);
    } catch (err) {
      if (err instanceof DOMException && err.name === 'NotAllowedError') {
        alert('마이크 접근 권한이 필요합니다. 브라우저 설정에서 권한을 허용해주세요.');
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── 녹음 정지 ─────────────────────────────────────────────────
  const handleStopRecording = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  }, []);

  // ── 음성 재생/일시정지 ─────────────────────────────────────────
  const handleTogglePlayVoice = useCallback(() => {
    if (!voiceBlob) return;

    if (!audioRef.current) {
      const url = URL.createObjectURL(voiceBlob);
      const audio = new Audio(url);
      audio.onended = () => setIsPlaying(false);
      audioRef.current = audio;
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  }, [voiceBlob, isPlaying]);

  // ── 음성 삭제 (재녹음을 위해 idle로 복귀) ────────────────────
  const handleDeleteVoice = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setVoiceBlob(null);
    setVoiceDuration(0);
    setRecordingSeconds(0);
    setIsPlaying(false);
    setRecordingState('idle');
  }, []);

  // ── 제출 ──────────────────────────────────────────────────────
  const handleSubmit = useCallback(async () => {
    if (imageFiles.length === 0) return;
    setIsSubmitting(true);
    setSubmitError('');

    try {
      // 1. 모든 이미지 동시 업로드 후 keys 수집
      const imageUploadPromises = imageFiles.map(async (file) => {
        const presigned = await getPresignedUrl('image', file.type);
        await uploadToPresignedUrl(presigned.upload_url, file, file.type);
        return presigned.object_key;
      });
      const imageKeys = await Promise.all(imageUploadPromises);

      // 2. 음성 업로드 (있을 때만)
      let voiceKey: string | undefined;
      if (voiceBlob) {
        const mimeType = voiceBlob.type || getSupportedMimeType();
        const voicePresigned = await getPresignedUrl('voice', mimeType);
        await uploadToPresignedUrl(voicePresigned.upload_url, voiceBlob, mimeType);
        voiceKey = voicePresigned.object_key;
      }

      // 3. 추억 등록
      await createMemory({
        title,
        image_keys: imageKeys,
        year: Number(year),
        location,
        people,
        story,
        ...(voiceKey ? { voice_key: voiceKey } : {}),
      });

      router.back();
    } catch {
      setSubmitError('저장에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setIsSubmitting(false);
    }
  }, [imageFiles, voiceBlob, title, year, location, people, story, router]);

  // 필수 필드 검증
  const isValid =
    imageFiles.length > 0 &&
    title.trim() !== '' &&
    year !== '' &&
    location.trim() !== '' &&
    people.trim() !== '' &&
    story.trim() !== '';

  return {
    // 폼
    title, setTitle,
    year, setYear,
    location, setLocation,
    people, setPeople,
    story, setStory,
    // 사진
    imageFiles,
    imagePreviewUrls,
    handleImageSelect,
    handleRemoveImage,
    // 녹음
    recordingState,
    voiceBlob,
    voiceDuration,
    recordingSeconds,
    isPlaying,
    handleStartRecording,
    handleStopRecording,
    handleTogglePlayVoice,
    handleDeleteVoice,
    // 제출
    isSubmitting,

    submitError,
    isValid,
    handleSubmit,
  };
}
