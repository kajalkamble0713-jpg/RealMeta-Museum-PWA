// Audio narration player with controls and transcript support
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward } from 'lucide-react';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { trackEvent, getSessionId } from '../lib/mockServices';

interface AudioPlayerProps {
  audioUrl?: string;
  artworkId: string;
  artworkTitle: string;
  fallbackText?: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ 
  audioUrl, 
  artworkId, 
  artworkTitle,
  fallbackText 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [useFallback, setUseFallback] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const startTimeRef = useRef<number>(0);
  const ttsTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleEnded = () => {
      setIsPlaying(false);
      trackAnalytics();
    };
    const handleError = () => {
      console.log('Audio file not available, using Web Speech API fallback');
      setUseFallback(true);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, []);

  useEffect(() => {
    // Clear any running TTS timer when unmounting
    return () => {
      if (ttsTimerRef.current) {
        window.clearInterval(ttsTimerRef.current);
        ttsTimerRef.current = null;
      }
    };
  }, []);

  const trackAnalytics = () => {
    const durationMs = Date.now() - startTimeRef.current;
    trackEvent({
      sessionId: getSessionId(),
      artworkId,
      event: 'audio_play',
      timestamp: new Date().toISOString(),
      durationSeconds: Math.floor(durationMs / 1000)
    });
  };

  const togglePlay = () => {
    if (useFallback || !audioUrl) {
      toggleSpeech();
      return;
    }

    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      trackAnalytics();
    } else {
      audio.play();
      startTimeRef.current = Date.now();
    }
    setIsPlaying(!isPlaying);
  };

  const startTtsProgress = (estimatedDurationSec: number | null) => {
    // Simulate progress bar for TTS so the UI moves while speaking
    if (ttsTimerRef.current) {
      window.clearInterval(ttsTimerRef.current);
      ttsTimerRef.current = null;
    }
    setCurrentTime(0);
    if (estimatedDurationSec && estimatedDurationSec > 0) {
      setDuration(estimatedDurationSec);
    } else {
      // Unknown duration; leave duration as-is (Slider will cap at 100)
      setDuration((d) => d || 100);
    }

    const tick = () => {
      const secs = (Date.now() - startTimeRef.current) / 1000;
      setCurrentTime(prev => {
        const next = estimatedDurationSec ? Math.min(secs, estimatedDurationSec) : secs;
        return next;
      });
    };
    ttsTimerRef.current = window.setInterval(tick, 250);
  };

  const stopTtsProgress = () => {
    if (ttsTimerRef.current) {
      window.clearInterval(ttsTimerRef.current);
      ttsTimerRef.current = null;
    }
  };

  const estimateTtsDuration = (text: string) => {
    // Rough estimate: ~160 wpm => ~2.67 wps
    const words = text.trim().split(/\s+/).length;
    const seconds = Math.ceil(words / 2.7);
    return Math.max(3, seconds);
  };

  const toggleSpeech = () => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        stopTtsProgress();
        setIsSpeaking(false);
        setIsPlaying(false);
        trackAnalytics();
      } else {
        const text = fallbackText || `${artworkTitle}. Audio narration coming soon.`;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onend = () => {
          stopTtsProgress();
          setIsSpeaking(false);
          setIsPlaying(false);
          trackAnalytics();
        };
        window.speechSynthesis.speak(utterance);
        setIsSpeaking(true);
        setIsPlaying(true);
        startTimeRef.current = Date.now();
        startTtsProgress(estimateTtsDuration(text));
      }
    }
  };

  const handleSeek = (value: number[]) => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume || 0.5;
        setIsMuted(false);
      } else {
        audioRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  const skip = (seconds: number) => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = Math.max(0, Math.min(duration, audio.currentTime + seconds));
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-[#FAF6F1] rounded-lg p-6 border border-[#D4A574]">
      <div className="flex items-center gap-2 mb-4">
        <Volume2 className="w-5 h-5 text-[#8B4513]" />
        <h3 className="text-[#2C2C2C]">Audio Guide</h3>
      </div>

      {!useFallback && audioUrl && (
        <audio ref={audioRef} src={audioUrl} preload="metadata" />
      )}

      {(useFallback || !audioUrl) && (
        <div className="mb-4 p-3 bg-white rounded border border-[#D4A574] text-sm text-[#6B6B6B]">
          Using text-to-speech narration. For best experience, enable browser audio.
        </div>
      )}

      {/* Progress bar */}
      <div className="mb-4">
        <Slider
          value={[currentTime]}
          max={duration || 100}
          step={0.1}
          onValueChange={handleSeek}
          disabled={useFallback || !audioUrl}
          className="w-full"
        />
        <div className="flex justify-between mt-2 text-sm text-[#6B6B6B]">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => skip(-10)}
            disabled={useFallback || !audioUrl}
            className="border-[#8B4513] text-[#8B4513]"
          >
            <SkipBack className="w-4 h-4" />
          </Button>
          
          <Button
            size="icon"
            onClick={togglePlay}
            className="bg-[#8B4513] hover:bg-[#6D3410] text-white h-12 w-12"
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={() => skip(10)}
            disabled={useFallback || !audioUrl}
            className="border-[#8B4513] text-[#8B4513]"
          >
            <SkipForward className="w-4 h-4" />
          </Button>
        </div>

        {/* Volume control */}
        {!useFallback && audioUrl && (
          <div className="flex items-center gap-2 w-32">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMute}
              className="text-[#8B4513]"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </Button>
            <Slider
              value={[isMuted ? 0 : volume]}
              max={1}
              step={0.01}
              onValueChange={handleVolumeChange}
              className="flex-1"
            />
          </div>
        )}
      </div>
    </div>
  );
};
