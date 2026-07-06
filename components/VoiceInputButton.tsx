"use client";

import { useCallback, useEffect, useState } from "react";
import { useVoiceInput } from "@/hooks/useVoiceInput";

interface Props {
  langCode: string;
  onInterim: (text: string) => void;
  onFinal: (text: string) => void;
}

export function VoiceInputButton({ langCode, onInterim, onFinal }: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const handleError = useCallback((msg: string) => {
    console.warn("[VoiceInput]", msg);
  }, []);

  const { isSupported, isListening, start } = useVoiceInput({
    lang: langCode,
    onInterim,
    onFinal,
    onError: handleError,
  });

  if (!mounted || !isSupported) return null;

  return (
    <button
      type="button"
      onClick={start}
      aria-label={isListening ? "Stop recording" : "Start voice input"}
      aria-pressed={isListening}
      title={isListening ? "Stop recording" : "Voice input"}
      className={`
        relative p-1.5 rounded-md transition-colors duration-150
        focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500
        ${
          isListening
            ? "text-rose-500 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 dark:hover:bg-rose-900/40"
            : "text-slate-400 dark:text-slate-500 hover:text-indigo-500 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800/60"
        }
      `}
    >
      {/* Pulse ring when recording */}
      {isListening && (
        <span
          className="absolute inset-0 rounded-md animate-pulse-mic"
          aria-hidden="true"
        />
      )}

      {/* Mic icon */}
      <svg
        viewBox="0 0 20 20"
        fill="currentColor"
        className="w-4 h-4 relative"
        aria-hidden="true"
      >
        <path d="M7 4a3 3 0 0 1 6 0v6a3 3 0 1 1-6 0V4Z" />
        <path d="M5.5 9.643a.75.75 0 0 0-1.5 0V10c0 3.06 2.29 5.585 5.25 5.954V17.5h-1.5a.75.75 0 0 0 0 1.5h4.5a.75.75 0 0 0 0-1.5h-1.5v-1.546A6.001 6.001 0 0 0 16 10v-.357a.75.75 0 0 0-1.5 0V10a4.5 4.5 0 0 1-9 0v-.357Z" />
      </svg>
    </button>
  );
}
