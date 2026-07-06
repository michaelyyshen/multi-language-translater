"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePhonetics } from "@/hooks/usePhonetics";

interface Props {
  text: string;
  langCode: string;
}

function PhoneticToken({ phonetic, word }: { phonetic: string | null; word: string }) {
  return (
    <span className="inline-flex flex-col items-center mx-1.5">
      <span className="font-mono text-indigo-600 dark:text-indigo-400 text-sm leading-none">
        {phonetic ?? <span className="opacity-30">—</span>}
      </span>
      <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 leading-none">
        {word}
      </span>
    </span>
  );
}

export function PhoneticPanel({ text, langCode }: Props) {
  const [open, setOpen] = useState(false);
  const { isLoading, perWord, system } = usePhonetics({ text, langCode });

  if (!system) return null;

  const isPinyin = system === "Pinyin";
  const label = isPinyin ? "拼音" : "IPA";
  const icon  = isPinyin ? "拼" : "ɪ";
  const emptyMsg = text.trim()
    ? "No transcription available."
    : `Type something to see ${isPinyin ? "Pinyin" : "IPA"}.`;

  return (
    <div className="mt-1">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={open ? `Hide ${label}` : `Show ${label}`}
        title={isPinyin ? "Pinyin transcription" : "IPA phonetic transcription"}
        className={`
          inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-mono
          transition-colors duration-150
          focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500
          ${open
            ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400"
            : "text-slate-400 dark:text-slate-500 hover:text-indigo-500 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800/60"
          }
        `}
      >
        <span className="text-[13px] leading-none">{icon}</span>
        <span className="font-sans">{label}</span>
        <motion.svg
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
          className="w-3 h-3"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
            clipRule="evenodd"
          />
        </motion.svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-2 rounded-xl border border-[var(--border)] bg-slate-50/80 dark:bg-slate-900/60 px-3 py-2.5">
              {isLoading ? (
                <div className="flex gap-2">
                  <div className="shimmer h-8 rounded w-14" />
                  <div className="shimmer h-8 rounded w-18" />
                  <div className="shimmer h-8 rounded w-12" />
                </div>
              ) : perWord.length > 0 ? (
                <div className="flex flex-wrap gap-y-2">
                  {perWord.map((entry, i) => (
                    <PhoneticToken key={i} word={entry.word} phonetic={entry.ipa} />
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 dark:text-slate-500 italic">
                  {emptyMsg}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
