/**
 * Google Translate free API helpers (no API key required)
 * Endpoint: https://translate.googleapis.com/translate_a/single
 *
 * Response shape: [[["translatedText","sourceText",...]], null, "detectedLangCode", ...]
 */

const BASE = "https://translate.googleapis.com/translate_a/single";

// Languages supported — full list matching Google Translate free API (gtx client) codes
export const SUPPORTED_LANGUAGES = [
  { code: "auto",  name: "Auto-detect" },
  { code: "af",    name: "Afrikaans" },
  { code: "sq",    name: "Albanian" },
  { code: "am",    name: "Amharic" },
  { code: "ar",    name: "Arabic" },
  { code: "hy",    name: "Armenian" },
  { code: "as",    name: "Assamese" },
  { code: "ay",    name: "Aymara" },
  { code: "az",    name: "Azerbaijani" },
  { code: "bm",    name: "Bambara" },
  { code: "eu",    name: "Basque" },
  { code: "be",    name: "Belarusian" },
  { code: "bn",    name: "Bengali" },
  { code: "bho",   name: "Bhojpuri" },
  { code: "bs",    name: "Bosnian" },
  { code: "bg",    name: "Bulgarian" },
  { code: "ca",    name: "Catalan" },
  { code: "ceb",   name: "Cebuano" },
  { code: "zh-CN", name: "Chinese (Simplified)" },
  { code: "zh-TW", name: "Chinese (Traditional)" },
  { code: "co",    name: "Corsican" },
  { code: "hr",    name: "Croatian" },
  { code: "cs",    name: "Czech" },
  { code: "da",    name: "Danish" },
  { code: "dv",    name: "Dhivehi" },
  { code: "doi",   name: "Dogri" },
  { code: "nl",    name: "Dutch" },
  { code: "en",    name: "English" },
  { code: "eo",    name: "Esperanto" },
  { code: "et",    name: "Estonian" },
  { code: "ee",    name: "Ewe" },
  { code: "fil",   name: "Filipino (Tagalog)" },
  { code: "fi",    name: "Finnish" },
  { code: "fr",    name: "French" },
  { code: "fy",    name: "Frisian" },
  { code: "gl",    name: "Galician" },
  { code: "ka",    name: "Georgian" },
  { code: "de",    name: "German" },
  { code: "el",    name: "Greek" },
  { code: "gn",    name: "Guarani" },
  { code: "gu",    name: "Gujarati" },
  { code: "ht",    name: "Haitian Creole" },
  { code: "ha",    name: "Hausa" },
  { code: "haw",   name: "Hawaiian" },
  { code: "iw",    name: "Hebrew" },
  { code: "hi",    name: "Hindi" },
  { code: "hmn",   name: "Hmong" },
  { code: "hu",    name: "Hungarian" },
  { code: "is",    name: "Icelandic" },
  { code: "ig",    name: "Igbo" },
  { code: "ilo",   name: "Ilocano" },
  { code: "id",    name: "Indonesian" },
  { code: "ga",    name: "Irish" },
  { code: "it",    name: "Italian" },
  { code: "ja",    name: "Japanese" },
  { code: "jw",    name: "Javanese" },
  { code: "kn",    name: "Kannada" },
  { code: "kk",    name: "Kazakh" },
  { code: "km",    name: "Khmer" },
  { code: "rw",    name: "Kinyarwanda" },
  { code: "gom",   name: "Konkani" },
  { code: "ko",    name: "Korean" },
  { code: "kri",   name: "Krio" },
  { code: "ku",    name: "Kurdish (Kurmanji)" },
  { code: "ckb",   name: "Kurdish (Sorani)" },
  { code: "ky",    name: "Kyrgyz" },
  { code: "lo",    name: "Lao" },
  { code: "la",    name: "Latin" },
  { code: "lv",    name: "Latvian" },
  { code: "ln",    name: "Lingala" },
  { code: "lt",    name: "Lithuanian" },
  { code: "lg",    name: "Luganda" },
  { code: "lb",    name: "Luxembourgish" },
  { code: "mk",    name: "Macedonian" },
  { code: "mai",   name: "Maithili" },
  { code: "mg",    name: "Malagasy" },
  { code: "ms",    name: "Malay" },
  { code: "ml",    name: "Malayalam" },
  { code: "mt",    name: "Maltese" },
  { code: "mi",    name: "Maori" },
  { code: "mr",    name: "Marathi" },
  { code: "mni-Mtei", name: "Meitei (Manipuri)" },
  { code: "lus",   name: "Mizo" },
  { code: "mn",    name: "Mongolian" },
  { code: "my",    name: "Myanmar (Burmese)" },
  { code: "ne",    name: "Nepali" },
  { code: "no",    name: "Norwegian" },
  { code: "ny",    name: "Nyanja (Chichewa)" },
  { code: "or",    name: "Odia (Oriya)" },
  { code: "om",    name: "Oromo" },
  { code: "ps",    name: "Pashto" },
  { code: "fa",    name: "Persian" },
  { code: "pl",    name: "Polish" },
  { code: "pt",    name: "Portuguese (Brazil)" },
  { code: "pa",    name: "Punjabi" },
  { code: "qu",    name: "Quechua" },
  { code: "ro",    name: "Romanian" },
  { code: "ru",    name: "Russian" },
  { code: "sm",    name: "Samoan" },
  { code: "sa",    name: "Sanskrit" },
  { code: "gd",    name: "Scots Gaelic" },
  { code: "nso",   name: "Sepedi" },
  { code: "sr",    name: "Serbian" },
  { code: "st",    name: "Sesotho" },
  { code: "sn",    name: "Shona" },
  { code: "sd",    name: "Sindhi" },
  { code: "si",    name: "Sinhala (Sinhalese)" },
  { code: "sk",    name: "Slovak" },
  { code: "sl",    name: "Slovenian" },
  { code: "so",    name: "Somali" },
  { code: "es",    name: "Spanish" },
  { code: "su",    name: "Sundanese" },
  { code: "sw",    name: "Swahili" },
  { code: "sv",    name: "Swedish" },
  { code: "tl",    name: "Tagalog (Filipino)" },
  { code: "tg",    name: "Tajik" },
  { code: "ta",    name: "Tamil" },
  { code: "tt",    name: "Tatar" },
  { code: "te",    name: "Telugu" },
  { code: "th",    name: "Thai" },
  { code: "ti",    name: "Tigrinya" },
  { code: "ts",    name: "Tsonga" },
  { code: "tr",    name: "Turkish" },
  { code: "tk",    name: "Turkmen" },
  { code: "ak",    name: "Twi (Akan)" },
  { code: "uk",    name: "Ukrainian" },
  { code: "ur",    name: "Urdu" },
  { code: "ug",    name: "Uyghur" },
  { code: "uz",    name: "Uzbek" },
  { code: "vi",    name: "Vietnamese" },
  { code: "cy",    name: "Welsh" },
  { code: "xh",    name: "Xhosa" },
  { code: "yi",    name: "Yiddish" },
  { code: "yo",    name: "Yoruba" },
  { code: "zu",    name: "Zulu" },
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

  const raw = await res.text();
  let data: GoogleTranslateResponse;
  try {
    data = JSON.parse(raw) as GoogleTranslateResponse;
  } catch {
    throw new Error(`Google Translate returned non-JSON response (status ${res.status})`);
  }

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
