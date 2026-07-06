"use client";

import { useRef, useState, useCallback, useEffect } from "react";

interface UseAudioOutputReturn {
  isSupported: boolean;
  isSpeaking: boolean;
  speak: (text: string, lang: string) => void;
  cancel: () => void;
}

// Prefer a voice that matches the language code
function pickVoice(lang: string): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;
  const normalized = lang.toLowerCase();
  // Exact match first
  const exact = voices.find((v) => v.lang.toLowerCase() === normalized);
  if (exact) return exact;
  // Prefix match (e.g. "zh" matches "zh-CN")
  const prefix = normalized.split("-")[0];
  return voices.find((v) => v.lang.toLowerCase().startsWith(prefix)) ?? null;
}

export function useAudioOutput(): UseAudioOutputReturn {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [voicesLoaded, setVoicesLoaded] = useState(false);

  const isSupported =
    typeof window !== "undefined" && "speechSynthesis" in window;

  useEffect(() => {
    if (!isSupported) return;
    const synth = window.speechSynthesis;
    // Voices load asynchronously on some browsers
    function onVoicesChanged() {
      setVoicesLoaded(true);
    }
    synth.addEventListener("voiceschanged", onVoicesChanged);
    // Trigger immediately if already loaded
    if (synth.getVoices().length > 0) setVoicesLoaded(true);
    return () => synth.removeEventListener("voiceschanged", onVoicesChanged);
  }, [isSupported]);

  // Cancel on unmount
  useEffect(() => {
    return () => {
      if (isSupported) window.speechSynthesis.cancel();
    };
  }, [isSupported]);

  const cancel = useCallback(() => {
    if (!isSupported) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, [isSupported]);

  const speak = useCallback(
    (text: string, lang: string) => {
      if (!isSupported || !text.trim()) return;
      if (isSpeaking) {
        cancel();
        return;
      }

      const synth = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === "auto" ? "en-US" : lang;

      const voice = pickVoice(utterance.lang);
      if (voice) utterance.voice = voice;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      utteranceRef.current = utterance;
      synth.speak(utterance);
    },
    [isSupported, isSpeaking, cancel]
  );

  // voicesLoaded is used to re-trigger voice selection in components that depend on it,
  // but speak() itself already calls getVoices() at speak-time, so no extra dep needed.
  void voicesLoaded;

  return { isSupported, isSpeaking, speak, cancel };
}
