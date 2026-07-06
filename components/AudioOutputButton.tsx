"use client";

import { useEffect, useState } from "react";
import { useAudioOutput } from "@/hooks/useAudioOutput";

interface Props {
  text: string;
  langCode: string;
}

export function AudioOutputButton({ text, langCode }: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const { isSupported, isSpeaking, speak } = useAudioOutput();

  if (!mounted || !isSupported) return null;

  const hasText = text.trim().length > 0;

  return (
    <button
      type="button"
      onClick={() => speak(text, langCode)}
      disabled={!hasText}
      aria-label={isSpeaking ? "Stop speaking" : "Read aloud"}
      aria-pressed={isSpeaking}
      title={isSpeaking ? "Stop speaking" : "Read aloud"}
      className={`
        p-1.5 rounded-md transition-colors duration-150
        focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500
        disabled:opacity-30 disabled:cursor-not-allowed
        ${
          isSpeaking
            ? "text-indigo-500 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/40"
            : "text-slate-400 dark:text-slate-500 hover:text-indigo-500 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800/60"
        }
      `}
    >
      {isSpeaking ? (
        /* Sound-wave icon (animated bars) */
        <svg
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-4 h-4"
          aria-hidden="true"
        >
          {/* Simple waveform made of 4 bars */}
          <rect x="2" y="7" width="2.5" height="6" rx="1" className="animate-soundbar-1" />
          <rect x="6" y="4" width="2.5" height="12" rx="1" className="animate-soundbar-2" />
          <rect x="10" y="6" width="2.5" height="8" rx="1" className="animate-soundbar-3" />
          <rect x="14" y="3" width="2.5" height="14" rx="1" className="animate-soundbar-4" />
        </svg>
      ) : (
        /* Speaker icon */
        <svg
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-4 h-4"
          aria-hidden="true"
        >
          <path d="M10.5 3.75a.75.75 0 0 0-1.264-.546L5.203 7H2.667a.75.75 0 0 0-.7.48A6.985 6.985 0 0 0 1.5 10c0 .887.165 1.737.468 2.52.111.29.39.48.7.48h2.535l4.033 3.796a.75.75 0 0 0 1.264-.546V3.75ZM16.45 5.05a.75.75 0 0 0-1.06 1.061 5.5 5.5 0 0 1 0 7.778.75.75 0 0 0 1.06 1.06 7 7 0 0 0 0-9.899Z" />
          <path d="M14.329 7.172a.75.75 0 0 0-1.061 1.06 2.5 2.5 0 0 1 0 3.536.75.75 0 0 0 1.06 1.06 4 4 0 0 0 0-5.656Z" />
        </svg>
      )}
    </button>
  );
}
