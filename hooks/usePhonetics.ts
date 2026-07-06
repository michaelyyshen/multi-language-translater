"use client";

import { useState, useEffect, useRef } from "react";
import { arpabetStringToIpa } from "@/lib/phonetics";

interface UsePhoneticsOptions {
  text: string;
  langCode: string;
}

interface UsePhoneticsReturn {
  isLoading: boolean;
  perWord: Array<{ word: string; ipa: string | null }>;
  combined: string;
  /** Label for the phonetic system in use: "IPA", "Pinyin", etc. */
  system: string | null;
}

const DEBOUNCE_MS = 300;
const MAX_WORDS = 10;

const isChinese = (code: string) =>
  code === "zh" || code === "zh-CN" || code === "zh-TW" || code === "zh-HK";

const isEnglish = (code: string) => code === "en" || code === "en-US" || code === "en-GB";

async function fetchEnglishIpa(
  words: string[],
  signal: AbortSignal
): Promise<Array<{ word: string; ipa: string | null }>> {
  return Promise.all(
    words.map(async (w) => {
      try {
        const res = await fetch(
          `https://api.datamuse.com/words?sp=${encodeURIComponent(w)}&md=r&max=5`,
          { signal }
        );
        if (!res.ok) return { word: w, ipa: null };
        const data: Array<{ word?: string; tags?: string[] }> = await res.json();
        // Find exact match first, then fall back to first result
        const entry =
          data.find((e) => e.word?.toLowerCase() === w.toLowerCase()) ?? data[0];
        const pronTag = entry?.tags?.find((t) => t.startsWith("pron:"));
        const pron = pronTag ? pronTag.slice(5).trim() : null;
        const ipa = pron ? arpabetStringToIpa(pron) : null;
        return { word: w, ipa };
      } catch {
        return { word: w, ipa: null };
      }
    })
  );
}

async function fetchChinesePinyin(
  text: string
): Promise<Array<{ word: string; ipa: string | null }>> {
  // pinyin-pro is a pure-JS library, safe to import dynamically on client
  const { pinyin } = await import("pinyin-pro");
  // Split into individual characters (Chinese words don't have spaces)
  const chars = text.replace(/\s+/g, "").split("");
  return chars.map((ch) => {
    const py = pinyin(ch, { toneType: "symbol", type: "array" })[0] ?? null;
    return { word: ch, ipa: py ?? null };
  });
}

export function usePhonetics({ text, langCode }: UsePhoneticsOptions): UsePhoneticsReturn {
  const [perWord, setPerWord] = useState<Array<{ word: string; ipa: string | null }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const cancelRef = useRef<AbortController | null>(null);

  const system = isEnglish(langCode)
    ? "IPA"
    : isChinese(langCode)
    ? "Pinyin"
    : null;

  useEffect(() => {
    const trimmed = text.trim();

    if (!system || !trimmed) {
      setPerWord([]);
      setIsLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      cancelRef.current?.abort();
      const controller = new AbortController();
      cancelRef.current = controller;
      setIsLoading(true);

      try {
        let results: Array<{ word: string; ipa: string | null }>;

        if (isEnglish(langCode)) {
          const words = trimmed
            .replace(/[^a-zA-Z0-9\s'-]/g, " ")
            .split(/\s+/)
            .filter(Boolean)
            .slice(0, MAX_WORDS);
          if (words.length === 0) {
            setPerWord([]);
            setIsLoading(false);
            return;
          }
          results = await fetchEnglishIpa(words, controller.signal);
        } else {
          // Chinese — pinyin-pro works synchronously but we wrap in async for consistency
          results = await fetchChinesePinyin(trimmed);
        }

        if (!controller.signal.aborted) {
          setPerWord(results);
          setIsLoading(false);
        }
      } catch {
        if (!controller.signal?.aborted) {
          setPerWord([]);
          setIsLoading(false);
        }
      }
    }, DEBOUNCE_MS);

    return () => {
      clearTimeout(timer);
    };
  }, [text, langCode, system]);

  const combined = perWord.length
    ? perWord.map((w) => w.ipa ?? w.word).join(isChinese(langCode) ? " " : " ")
    : "";

  return { isLoading, perWord, combined, system };
}
