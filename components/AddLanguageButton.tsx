"use client";

import { motion } from "framer-motion";

interface Props {
  onClick: () => void;
}

export function AddLanguageButton({ onClick }: Props) {
  return (
    <motion.button
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="
        w-full flex items-center justify-center gap-2
        rounded-2xl border-2 border-dashed
        border-slate-300 dark:border-slate-600
        text-slate-500 dark:text-slate-400
        hover:border-indigo-400 dark:hover:border-indigo-500
        hover:text-indigo-600 dark:hover:text-indigo-400
        hover:bg-indigo-50/60 dark:hover:bg-indigo-950/30
        py-5 px-4 text-sm font-medium
        transition-colors duration-200
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500
      "
      aria-label="Add a language block"
    >
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden="true">
        <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
      </svg>
      Add language
    </motion.button>
  );
}
