import { useEffect } from 'react';

export function useClickSound(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    let audio: AudioContext | undefined;
    const play = (event: PointerEvent) => {
      if (!(event.target instanceof Element) || !event.target.closest('button:not(:disabled), a')) return;
      audio ??= new AudioContext();
      void audio.resume();
      const oscillator = audio.createOscillator();
      const volume = audio.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(650, audio.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(380, audio.currentTime + 0.035);
      volume.gain.setValueAtTime(0.025, audio.currentTime);
      volume.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + 0.05);
      oscillator.connect(volume);
      volume.connect(audio.destination);
      oscillator.start();
      oscillator.stop(audio.currentTime + 0.05);
    };
    window.addEventListener('pointerup', play);
    return () => {
      window.removeEventListener('pointerup', play);
      if (audio) void audio.close();
    };
  }, [enabled]);
}
