import { useState, useEffect, useCallback, useRef } from 'react';

export function useTTS() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  const play = useCallback((url: string | null | undefined) => {
    // Stop any ongoing playback first
    stop();

    if (!url) return;

    const audio = new Audio(url);
    audioRef.current = audio;

    audio.onplay = () => setIsPlaying(true);
    audio.onended = () => setIsPlaying(false);
    audio.onerror = () => setIsPlaying(false);
    audio.onpause = () => setIsPlaying(false);

    audio.play().catch((error) => {
      console.error('Audio playback failed:', error);
      setIsPlaying(false);
    });
  }, [stop]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  return { play, stop, isPlaying };
}
