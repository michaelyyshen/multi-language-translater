/**
 * MyMemory translation API (free, no API key required)
 * Endpoint: https://api.mymemory.translated.net/get
 *
 * Response shape: { responseData: { translatedText: string, match: number }, responseStatus: number, matches: [...] }
 */

const BASE = "https://api.mymemory.translated.net/get";

// Languages supported — full list matching MyMemory supported language codes
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

type MyMemoryResponse = {
  responseData?: { translatedText?: string; match?: number };
  responseStatus?: number;
  responseDetails?: string;
  matches?: Array<{ translation?: string }>;
};

async function myMemoryTranslate(
  text: string,
  sl: string,
  tl: string
): Promise<string> {
  const langPair = sl === "auto" ? `Autodetect|${tl}` : `${sl}|${tl}`;
  const params = new URLSearchParams({ q: text, langpair: langPair });

  const res = await fetch(`${BASE}?${params.toString()}`, {
    headers: { "User-Agent": "Mozilla/5.0 multi-language-translater" },
  });

  if (!res.ok) {
    throw new Error(`MyMemory request failed: ${res.status}`);
  }

  const data = (await res.json()) as MyMemoryResponse;

  if (data.responseStatus && data.responseStatus !== 200) {
    throw new Error(data.responseDetails || `MyMemory error ${data.responseStatus}`);
  }

  const translated = data.responseData?.translatedText;
  if (typeof translated !== "string" || translated === "") {
    throw new Error("MyMemory returned empty translation");
  }

  // MyMemory sometimes returns warnings in the translated text (e.g. "MYMEMORY WARNING ...")
  // The actual translation is the first segment before any newline.
  const cleaned = translated.split("\n")[0].trim();
  return cleaned;
}

/**
 * MyMemory does not support autodetect. We default the source to English.
 * (The UI's "auto" block still works — it just means "I'll pick a source".)
 */
export async function detectLanguage(_text: string): Promise<string> {
  return "en";
}

/** Translate text from source to target language */
export async function translateText(
  text: string,
  source: string,
  target: string
): Promise<string> {
  const sl = source === "auto" ? "auto" : source;
  return myMemoryTranslate(text, sl, target);
}