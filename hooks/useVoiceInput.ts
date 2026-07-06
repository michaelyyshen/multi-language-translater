"use client";

import { useRef, useState, useCallback, useEffect } from "react";

interface UseVoiceInputOptions {
  lang: string;
  onInterim: (text: string) => void;
  onFinal: (text: string) => void;
  onError?: (message: string) => void;
}

interface UseVoiceInputReturn {
  isSupported: boolean;
  isListening: boolean;
  start: () => void;
  stop: () => void;
}

// Normalise BCP-47 codes that SpeechRecognition may not accept as-is
function normaliseLang(code: string): string {
  if (code === "auto") return "en-US";
  // zh-CN / zh-TW are already valid BCP-47 for Chrome
  const map: Record<string, string> = {
    en: "en-US",
    fr: "fr-FR",
    de: "de-DE",
    es: "es-ES",
    it: "it-IT",
    pt: "pt-BR",
    ru: "ru-RU",
    ja: "ja-JP",
    ko: "ko-KR",
    ar: "ar-SA",
    hi: "hi-IN",
    nl: "nl-NL",
    pl: "pl-PL",
    sv: "sv-SE",
    tr: "tr-TR",
    uk: "uk-UA",
    vi: "vi-VN",
    id: "id-ID",
  };
  return map[code] ?? code;
}

// SpeechRecognition is not in the standard TypeScript lib
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}
interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}
interface SpeechRecognitionInstance extends EventTarget {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((e: SpeechRecognitionEvent) => void) | null;
  onerror: ((e: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition: new () => SpeechRecognitionInstance;
  }
}

export function useVoiceInput({
  lang,
  onInterim,
  onFinal,
  onError,
}: UseVoiceInputOptions): UseVoiceInputReturn {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  // Detect support client-side only to avoid SSR/hydration mismatch
  useEffect(() => {
    setIsSupported(
      "SpeechRecognition" in window || "webkitSpeechRecognition" in window
    );
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      recognitionRef.current?.abort();
    };
  }, []);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  const start = useCallback(() => {
    if (!isSupported) return;
    if (isListening) {
      stop();
      return;
    }

    const SpeechRecognitionCtor =
      window.SpeechRecognition ?? window.webkitSpeechRecognition;
    const recognition = new SpeechRecognitionCtor();
    recognition.lang = normaliseLang(lang);
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (e: SpeechRecognitionEvent) => {
      let interim = "";
      let final = "";
      for (let i = e.results.length - 1; i >= 0; i--) {
        const result = e.results[i];
        if (result.isFinal) {
          final = result[0].transcript;
          break;
        } else {
          interim = result[0].transcript;
        }
      }
      if (final) {
        onFinal(final);
      } else if (interim) {
        onInterim(interim);
      }
    };

    recognition.onerror = (e: SpeechRecognitionErrorEvent) => {
      setIsListening(false);
      if (e.error !== "aborted" && e.error !== "no-speech") {
        onError?.(e.error);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }, [isSupported, isListening, lang, onInterim, onFinal, onError, stop]);

  return { isSupported, isListening, start, stop };
}
