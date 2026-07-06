"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { nanoid } from "nanoid";
import type { Block, Language } from "@/lib/types";

const DEBOUNCE_MS = 400;
const MAX_BLOCKS = 5;

const DEFAULT_LANG_CODES = ["en", "zh-CN", "de", "fr", "es", "ja", "ko", "ar", "pt", "ru"];

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
    fetch("/api/translate")
      .then((r) => r.json())
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
          ...DEFAULT_LANG_CODES.map((c) => ({ code: c, name: c.toUpperCase() })),
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

      const targets = prev
        .filter((b) => b.id !== sourceId)
        .map((b) => b.langCode)
        .filter((c) => c !== "auto");

      if (targets.length === 0) return prev;

      const next = prev.map((b) =>
        b.id === sourceId ? b : { ...b, isLoading: true, error: null }
      );

      const q = source.text;
      const sourceLang = source.langCode;

      fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ q, source: sourceLang, targets }),
      })
        .then((r) => r.json())
        .then((data: { translations?: Record<string, string>; detectedLanguage?: string; error?: string }) => {
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
              const translated = data.translations?.[b.langCode];
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
        DEFAULT_LANG_CODES.find((l) => !usedLangs.has(l)) ?? DEFAULT_LANG_CODES[0];
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
    handleLangChange,
    addBlock,
    removeBlock,
  };
}
