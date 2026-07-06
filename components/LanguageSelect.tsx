"use client";

import type { Language } from "@/lib/types";

interface Props {
  value: string;
  languages: Language[];
  detectedLang?: string;
  onChange: (langCode: string) => void;
}

export function LanguageSelect({ value, languages, detectedLang, onChange }: Props) {
  return (
    <div className="relative inline-flex items-center gap-1 min-w-0">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="
          appearance-none bg-transparent pr-5 pl-0 py-0.5 max-w-[160px]
          text-sm font-semibold truncate
          text-slate-700 dark:text-slate-200
          focus:outline-none cursor-pointer
          hover:text-indigo-600 dark:hover:text-indigo-400
          transition-colors duration-150
        "
        aria-label="Select language"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code} className="bg-white dark:bg-slate-800">
            {lang.code === "auto" && detectedLang
              ? `Auto (${languages.find((l) => l.code === detectedLang)?.name ?? detectedLang})`
              : lang.name}
          </option>
        ))}
      </select>
      {/* Chevron icon — inline SVG, no extra dependency */}
      <svg
        className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 dark:text-slate-500"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  );
}
