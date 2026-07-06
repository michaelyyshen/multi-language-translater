"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { LanguageSelect } from "./LanguageSelect";
import type { Block, Language } from "@/lib/types";

interface Props {
  block: Block;
  languages: Language[];
  canRemove: boolean;
  onTextChange: (id: string, text: string) => void;
  onLangChange: (id: string, langCode: string) => void;
  onRemove: (id: string) => void;
}

export function TranslationBlock({
  block,
  languages,
  canRemove,
  onTextChange,
  onLangChange,
  onRemove,
}: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-grow textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [block.text]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.94, y: -6 }}
      transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
      className="glass-card flex flex-col gap-3 p-4 relative"
    >
      {/* Header row: language selector + remove button */}
      <div className="flex items-center justify-between gap-2">
        <LanguageSelect
          value={block.langCode}
          languages={languages}
          detectedLang={block.detectedLang ?? undefined}
          onChange={(lc) => onLangChange(block.id, lc)}
        />

        {canRemove && (
          <button
            onClick={() => onRemove(block.id)}
            aria-label="Remove this language block"
            className="
              p-1 rounded-md text-slate-400 dark:text-slate-500
              hover:text-rose-500 dark:hover:text-rose-400
              hover:bg-rose-50 dark:hover:bg-rose-950/30
              transition-colors duration-150
            "
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden="true">
              <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
            </svg>
          </button>
        )}
      </div>

      {/* Textarea + shimmer overlay */}
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={block.text}
          onChange={(e) => onTextChange(block.id, e.target.value)}
          placeholder={
            block.langCode === "auto"
              ? "Type here to translate…"
              : `Translation in ${languages.find((l) => l.code === block.langCode)?.name ?? block.langCode}…`
          }
          rows={4}
          className="
            w-full bg-transparent resize-none overflow-hidden
            text-base text-slate-800 dark:text-slate-100
            placeholder:text-slate-400 dark:placeholder:text-slate-500
            focus:outline-none leading-relaxed
            transition-opacity duration-150
          "
          style={{ opacity: block.isLoading ? 0.35 : 1 }}
          aria-label={`Translation block for ${block.langCode}`}
        />

        {/* Shimmer loading overlay */}
        {block.isLoading && (
          <div className="absolute inset-0 flex flex-col gap-2.5 pt-0.5 pointer-events-none">
            <div className="shimmer h-4 rounded-md w-3/4" />
            <div className="shimmer h-4 rounded-md w-full" />
            <div className="shimmer h-4 rounded-md w-5/6" />
            <div className="shimmer h-4 rounded-md w-1/2" />
          </div>
        )}
      </div>

      {/* Error message */}
      {block.error && !block.isLoading && (
        <p className="text-xs text-rose-500 dark:text-rose-400 mt-1" role="alert">
          {block.error}
        </p>
      )}
    </motion.div>
  );
}
