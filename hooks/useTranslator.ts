"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { nanoid } from "nanoid";
import type { Block, Language } from "@/lib/types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "";

async function safeJson<T>(res: Response): Promise<T> {
  const text = await res.text();
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error(`Server returned non-JSON response (${res.status})`);
  }
}

const DEBOUNCE_MS = 400;
const MAX_BLOCKS = 5;

const DEFAULT_LANGUAGES: Language[] = [
  { code: "en",    name: "English" },
  { code: "zh-CN", name: "Chinese (Simplified)" },
  { code: "zh-TW", name: "Chinese (Traditional)" },
  { code: "de",    name: "German" },
  { code: "fr",    name: "French" },
  { code: "es",    name: "Spanish" },
  { code: "ja",    name: "Japanese" },
  { code: "ko",    name: "Korean" },
  { code: "ar",    name: "Arabic" },
  { code: "pt",    name: "Portuguese" },
  { code: "ru",    name: "Russian" },
];

function makeBlock(langCode: string, text = ""): Block {
  return { id: nanoid(), langCode, text, isLoading: false, error: null };
}

export function useTranslator() {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [blocks, setBlocks] = useState<Block[]>([
    makeBlock("auto"),
    makeBlock("en"),
  ]);

  const activeBlockIdRef = useRef<string | null>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/translate`, { cache: "no-store" })
      .then((r) => safeJson<{ languages?: Language[] }>(r))
      .then((data) => {
        if (data.languages) {
          setLanguages([
            { code: "auto", name: "Auto-detect" },
            ...data.languages,
          ]);
        }
      })
      .catch(() => {
        setLanguages([
          { code: "auto", name: "Auto-detect" },
          ...DEFAULT_LANGUAGES,
        ]);
      });
  }, []);

  const translateFrom = useCallback((sourceId: string) => {
    setBlocks((prev) => {
      const source = prev.find((b) => b.id === sourceId);
      if (!source || source.text.trim() === "") {
        return prev.map((b) =>
          b.id === sourceId ? b : { ...b, text: "", isLoading: false, error: null }
        );
      }

      // For "auto" blocks, use the already-detected language as the target.
      // If detection hasn't happened yet, skip that block.
      const targets = prev
        .filter((b) => b.id !== sourceId)
        .map((b) => (b.langCode === "auto" ? (b.detectedLang ?? null) : b.langCode))
        .filter((c): c is string => c !== null);

      if (targets.length === 0) return prev;

      // Only mark loading for blocks that will actually receive a translation.
      // Auto blocks without a detectedLang are skipped from targets, so don't spin them.
      const targetSet = new Set(targets);
      const next = prev.map((b) => {
        if (b.id === sourceId) return b;
        const effectiveLang = b.langCode === "auto" ? (b.detectedLang ?? null) : b.langCode;
        if (!effectiveLang || !targetSet.has(effectiveLang)) return { ...b, isLoading: false };
        return { ...b, isLoading: true, error: null };
      });

      const q = source.text;
      const sourceLang = source.langCode;

      fetch(`${API_BASE}/api/translate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ q, source: sourceLang, targets }),
      })
        .then((r) => safeJson<{ translations?: Record<string, string>; detectedLanguage?: string; error?: string }>(r))
        .then((data) => {
          if (data.error) throw new Error(data.error);
          setBlocks((current) => {
            if (activeBlockIdRef.current !== sourceId) return current;
            return current.map((b) => {
              if (b.id === sourceId) {
                if (sourceLang === "auto" && data.detectedLanguage) {
                  return { ...b, detectedLang: data.detectedLanguage };
                }
                return b;
              }
              // Auto block: look up by detectedLang since the API key is the real lang code
              const lookupCode = b.langCode === "auto" ? b.detectedLang : b.langCode;
              const translated = lookupCode ? data.translations?.[lookupCode] : undefined;
              return {
                ...b,
                text: translated !== undefined ? translated : b.text,
                isLoading: false,
                error: null,
              };
            });
          });
        })
        .catch((err: Error) => {
          setBlocks((current) =>
            current.map((b) =>
              b.id === sourceId
                ? b
                : { ...b, isLoading: false, error: err.message }
            )
          );
        });

      return next;
    });
  }, []);

  const handleTextChange = useCallback(
    (id: string, text: string) => {
      activeBlockIdRef.current = id;
      setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, text } : b)));

      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = setTimeout(() => {
        if (activeBlockIdRef.current === id) {
          translateFrom(id);
        }
      }, DEBOUNCE_MS);
    },
    [translateFrom]
  );

  // Updates text locally without scheduling a translation — used for interim
  // voice recognition results so we don't fire API calls mid-speech.
  const handleTextSilent = useCallback((id: string, text: string) => {
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, text } : b)));
  }, []);

  const handleLangChange = useCallback(
    (id: string, langCode: string) => {
      setBlocks((prev) =>
        prev.map((b) =>
          b.id === id ? { ...b, langCode, detectedLang: undefined } : b
        )
      );
      setTimeout(() => {
        setBlocks((prev) => {
          const changed = prev.find((b) => b.id === id);
          if (changed && changed.text.trim()) {
            activeBlockIdRef.current = id;
            translateFrom(id);
          } else {
            const source = prev.find((b) => b.text.trim() !== "");
            if (source) {
              activeBlockIdRef.current = source.id;
              translateFrom(source.id);
            }
          }
          return prev;
        });
      }, 0);
    },
    [translateFrom]
  );

  const addBlock = useCallback(() => {
    setBlocks((prev) => {
      if (prev.length >= MAX_BLOCKS) return prev;
      const usedLangs = new Set(prev.map((b) => b.langCode));
      const nextLang =
        DEFAULT_LANGUAGES.find((l) => !usedLangs.has(l.code))?.code ?? DEFAULT_LANGUAGES[0].code;
      const newBlock = makeBlock(nextLang);
      // Translate into new block immediately if there's a source
      const source = prev.find((b) => b.text.trim() !== "");
      if (source) {
        setTimeout(() => {
          activeBlockIdRef.current = source.id;
          translateFrom(source.id);
        }, 0);
      }
      return [...prev, newBlock];
    });
  }, [translateFrom]);

  const removeBlock = useCallback((id: string) => {
    setBlocks((prev) => {
      if (prev.length <= 2) return prev;
      return prev.filter((b) => b.id !== id);
    });
  }, []);

  const canAdd = blocks.length < MAX_BLOCKS;
  const canRemove = blocks.length > 2;

  return {
    blocks,
    languages,
    canAdd,
    canRemove,
    handleTextChange,
    handleTextSilent,
    handleLangChange,
    addBlock,
    removeBlock,
  };
}
