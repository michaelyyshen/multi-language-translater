"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import type { Language } from "@/lib/types";

interface Props {
  value: string;
  languages: Language[];
  detectedLang?: string;
  onChange: (langCode: string) => void;
}

export function LanguageSelect({ value, languages, detectedLang, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 208 });
  const [mounted, setMounted] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => { setMounted(true); }, []);

  const selected = languages.find((l) => l.code === value);
  const label =
    selected?.code === "auto" && detectedLang
      ? `Auto (${languages.find((l) => l.code === detectedLang)?.name ?? detectedLang})`
      : (selected?.name ?? value);

  const filtered = search.trim()
    ? languages.filter((l) => l.name.toLowerCase().includes(search.toLowerCase()))
    : languages;

  const close = useCallback(() => {
    setOpen(false);
    setSearch("");
  }, []);

  function openDropdown() {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + window.scrollY + 6,
        left: rect.left + window.scrollX,
        width: 208,
      });
    }
    setOpen((o) => !o);
  }

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handle(e: MouseEvent) {
      const target = e.target as Node;
      const inButton = buttonRef.current?.contains(target);
      const inContainer = containerRef.current?.contains(target);
      if (!inButton && !inContainer) close();
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open, close]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    function handle(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    document.addEventListener("keydown", handle);
    return () => document.removeEventListener("keydown", handle);
  }, [open, close]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (open) {
      setTimeout(() => searchRef.current?.focus(), 30);
    }
  }, [open]);

  function handleSelect(code: string) {
    onChange(code);
    close();
  }

  const dropdown = (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0, scale: 0.96, y: -4 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -4 }}
          transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
          style={{
            position: "absolute",
            top: dropdownPos.top,
            left: dropdownPos.left,
            width: dropdownPos.width,
            zIndex: 9999,
          }}
          className="
            rounded-xl overflow-hidden
            bg-white dark:bg-[#1a1d2e]
            border border-[var(--border)]
            shadow-xl shadow-black/10 dark:shadow-black/40
          "
        >
          {/* Search */}
          <div className="p-2 border-b border-[var(--border)]">
            <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/60">
              <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clipRule="evenodd" />
              </svg>
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search…"
                className="
                  flex-1 bg-transparent text-xs text-slate-700 dark:text-slate-200
                  placeholder:text-slate-400 focus:outline-none min-w-0
                "
              />
            </div>
          </div>

          {/* Options list */}
          <ul
            ref={listRef}
            role="listbox"
            aria-label="Select language"
            className="max-h-52 overflow-y-auto py-1 overscroll-contain"
          >
            {filtered.length === 0 ? (
              <li className="px-3 py-2 text-xs text-slate-400 dark:text-slate-500">
                No languages found
              </li>
            ) : (
              filtered.map((lang) => {
                const isSelected = lang.code === value;
                const optLabel =
                  lang.code === "auto" && detectedLang
                    ? `Auto (${languages.find((l) => l.code === detectedLang)?.name ?? detectedLang})`
                    : lang.name;
                return (
                  <li
                    key={lang.code}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(lang.code)}
                    className={`
                      flex items-center justify-between gap-2
                      px-3 py-2 mx-1 rounded-lg
                      text-sm cursor-pointer select-none
                      transition-colors duration-100
                      ${isSelected
                        ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-semibold"
                        : "text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                      }
                    `}
                  >
                    <span className="truncate">{optLabel}</span>
                    {isSelected && (
                      <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                      </svg>
                    )}
                  </li>
                );
              })
            )}
          </ul>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="relative">
      {/* Trigger button */}
      <button
        ref={buttonRef}
        type="button"
        onClick={openDropdown}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="
          inline-flex items-center gap-1.5 max-w-[180px]
          text-sm font-semibold
          text-slate-700 dark:text-slate-200
          hover:text-indigo-600 dark:hover:text-indigo-400
          transition-colors duration-150 focus:outline-none
          select-none
        "
      >
        <span className="truncate">{label}</span>
        <motion.svg
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
          className="w-3.5 h-3.5 shrink-0 text-slate-400 dark:text-slate-500"
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

      {/* Render dropdown via portal to escape stacking contexts */}
      {mounted && createPortal(dropdown, document.body)}
    </div>
  );
}
