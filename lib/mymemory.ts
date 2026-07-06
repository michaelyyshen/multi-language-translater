/**
 * Google Translate free API helpers (no API key required)
 * Endpoint: https://translate.googleapis.com/translate_a/single
 *
 * Response shape: [[["translatedText","sourceText",...]], null, "detectedLangCode", ...]
 */

const BASE = "https://translate.googleapis.com/translate_a/single";

// Languages supported — curated list matching Google Translate codes
export const SUPPORTED_LANGUAGES = [
  { code: "auto", name: "Auto-detect" },
  { code: "en", name: "English" },
  { code: "zh-CN", name: "Chinese (Simplified)" },
  { code: "zh-TW", name: "Chinese (Traditional)" },
  { code: "ar", name: "Arabic" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "hi", name: "Hindi" },
  { code: "id", name: "Indonesian" },
  { code: "it", name: "Italian" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "nl", name: "Dutch" },
  { code: "pl", name: "Polish" },
  { code: "pt", name: "Portuguese (Brazil)" },
  { code: "ru", name: "Russian" },
  { code: "es", name: "Spanish" },
  { code: "sv", name: "Swedish" },
  { code: "tr", name: "Turkish" },
  { code: "uk", name: "Ukrainian" },
  { code: "vi", name: "Vietnamese" },
];

type GoogleTranslateResponse = [
  Array<[string, string, ...unknown[]]>, // segments: [translated, original, ...]
  unknown,
  string | null, // detected language code (index 2)
  ...unknown[]
];

async function googleTranslate(
  text: string,
  sl: string,
  tl: string
): Promise<{ translated: string; detectedLang: string | null }> {
  const params = new URLSearchParams({
    client: "gtx",
    sl,
    tl,
    dt: "t",
    q: text,
  });

  const res = await fetch(`${BASE}?${params.toString()}`);
  if (!res.ok) {
    throw new Error(`Google Translate request failed: ${res.status}`);
  }

  const data = (await res.json()) as GoogleTranslateResponse;

  // Concatenate all translated segments
  const segments = data[0];
  const translated = segments
    .map((s) => (typeof s[0] === "string" ? s[0] : ""))
    .join("");

  // Detected language is at index 2
  const detectedLang = typeof data[2] === "string" ? data[2] : null;

  return { translated, detectedLang };
}

/**
 * Detect language of text by translating a short probe to English.
 * Returns an ISO 639-1 / BCP-47 language code (e.g. "zh-CN", "en", "fr").
 */
export async function detectLanguage(text: string): Promise<string> {
  const probe = text.slice(0, 50);
  const { detectedLang } = await googleTranslate(probe, "auto", "en");
  if (!detectedLang) throw new Error("Could not detect language");
  return detectedLang;
}

/** Translate text from source to target language */
export async function translateText(
  text: string,
  source: string,
  target: string
): Promise<string> {
  const sl = source === "auto" ? "auto" : source;
  const { translated } = await googleTranslate(text, sl, target);
  return translated;
}
