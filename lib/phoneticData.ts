/**
 * Static reference data for phonetic symbols by language.
 * Used as a fallback when no live IPA data is available (i.e. for any
 * language other than English). Each entry is a curated "cheatsheet" of
 * the most common IPA symbols / digraphs a learner would see.
 */

export interface PhonemeEntry {
  /** IPA symbol(s) or digraph as a string */
  symbol: string;
  /** Plain-English description (pronunciation hint) */
  example: string;
  /** Sample word */
  sample: string;
}

export interface LangPhonetics {
  /** Source language code (matches the keys used elsewhere: "en", "zh-CN", etc.) */
  code: string;
  /** Human-readable language name */
  name: string;
  /** Optional intro line shown above the cheatsheet */
  intro?: string;
  /** Common phonemes */
  phonemes: PhonemeEntry[];
}

export const LANG_PHONETICS: LangPhonetics[] = [
  {
    code: "en",
    name: "English",
    intro: "Live IPA is fetched from Datamuse when text is provided.",
    phonemes: [
      { symbol: "ɪ", example: "short i (sit)", sample: "kit" },
      { symbol: "iː", example: "long ee (see)", sample: "see" },
      { symbol: "ɛ", example: "short e (bed)", sample: "bed" },
      { symbol: "æ", example: "short a (cat)", sample: "cat" },
      { symbol: "ɑː", example: "long a (car)", sample: "car" },
      { symbol: "ɒ", example: "short o (lot)", sample: "lot" },
      { symbol: "ɔː", example: "long o (thought)", sample: "thought" },
      { symbol: "ʊ", example: "short u (foot)", sample: "foot" },
      { symbol: "uː", example: "long oo (food)", sample: "food" },
      { symbol: "ʌ", example: "schwa (cup)", sample: "cup" },
      { symbol: "ɜː", example: "er (bird)", sample: "bird" },
      { symbol: "ə", example: "schwa (about)", sample: "about" },
      { symbol: "eɪ", example: "long a (day)", sample: "day" },
      { symbol: "aɪ", example: "long i (my)", sample: "my" },
      { symbol: "ɔɪ", example: "long oy (boy)", sample: "boy" },
      { symbol: "aʊ", example: "long ow (now)", sample: "now" },
      { symbol: "oʊ", example: "long o (go)", sample: "go" },
      { symbol: "θ", example: "voiceless th", sample: "think" },
      { symbol: "ð", example: "voiced th", sample: "this" },
      { symbol: "ʃ", example: "sh", sample: "ship" },
      { symbol: "ʒ", example: "zh", sample: "vision" },
      { symbol: "tʃ", example: "ch", sample: "chip" },
      { symbol: "dʒ", example: "j", sample: "jam" },
      { symbol: "ŋ", example: "ng", sample: "sing" },
      { symbol: "ɹ", example: "r", sample: "red" },
      { symbol: "j", example: "y", sample: "yes" },
      { symbol: "w", example: "w", sample: "wet" },
    ],
  },
  {
    code: "zh-CN",
    name: "Mandarin (Pinyin)",
    intro: "Tones and finals — Mandarin uses tones 1–4 plus neutral.",
    phonemes: [
      { symbol: "maˉ", example: "tone 1 (high flat) — 妈", sample: "ma" },
      { symbol: "má", example: "tone 2 (rising) — 麻", sample: "má" },
      { symbol: "mǎ", example: "tone 3 (dipping) — 马", sample: "mǎ" },
      { symbol: "mà", example: "tone 4 (falling) — 骂", sample: "mà" },
      { symbol: "ma", example: "neutral tone", sample: "ma" },
      { symbol: "a / o / e / i / u / ü", example: "final vowels", sample: "—" },
      { symbol: "ai / ei / ui / ao / ou", example: "compound finals", sample: "—" },
      { symbol: "iu / ie / üe / er", example: "compound finals", sample: "—" },
      { symbol: "an / en / in / un / ün", example: "-n finals", sample: "—" },
      { symbol: "ang / eng / ing / ong", example: "-ng finals", sample: "—" },
      { symbol: "b p m f", example: "labial initials", sample: "—" },
      { symbol: "d t n l", example: "dental / alveolar", sample: "—" },
      { symbol: "g k h", example: "velar initials", sample: "—" },
      { symbol: "j q x", example: "palatal initials", sample: "—" },
      { symbol: "zh ch sh r", example: "retroflex initials", sample: "—" },
      { symbol: "z c s", example: "alveolar sibilants", sample: "—" },
    ],
  },
  {
    code: "ja",
    name: "Japanese",
    intro: "Pitch-accent mora notation. Look up a word in a pitch-accent dictionary.",
    phonemes: [
      { symbol: "a i u e o", example: "vowels", sample: "あいうえお" },
      { symbol: "ka ki ku ke ko", example: "k-row", sample: "かきくけこ" },
      { symbol: "sa shi su se so", example: "s-row (shi)", sample: "さしすせそ" },
      { symbol: "ta chi tsu te to", example: "t-row", sample: "たちつてと" },
      { symbol: "na ni nu ne no", example: "n-row", sample: "なにぬねの" },
      { symbol: "ha hi fu he ho", example: "h-row (fu)", sample: "はひふへほ" },
      { symbol: "ma mi mu me mo", example: "m-row", sample: "まみむめも" },
      { symbol: "ya yu yo", example: "y-row", sample: "やゆよ" },
      { symbol: "ra ri ru re ro", example: "r-row (flap)", sample: "らりるれろ" },
      { symbol: "wa wo n", example: "w + ん", sample: "—" },
      { symbol: "ga gi gu ge go", example: "voiced k-row", sample: "—" },
      { symbol: "za ji zu ze zo", example: "voiced s-row", sample: "—" },
      { symbol: "da dji dzu de do", example: "voiced t-row", sample: "—" },
      { symbol: "ba bi bu be bo", example: "voiced h-row", sample: "—" },
      { symbol: "pa pi pu pe po", example: "p-row", sample: "—" },
      { symbol: "ky / ny / hy / my / ry / py", example: "digraphs (拗音)", sample: "—" },
    ],
  },
  {
    code: "ko",
    name: "Korean",
    intro: "Hangul syllable blocks — initial + medial (+ optional final).",
    phonemes: [
      { symbol: "ㅏ ㅓ ㅗ ㅜ ㅡ ㅣ", example: "basic vowels", sample: "아어오우으이" },
      { symbol: "ㅑ ㅕ ㅛ ㅠ ㅒ ㅖ", example: "y-vowels", sample: "야여요유애에" },
      { symbol: "ㅐ ㅔ ㅚ ㅟ ㅢ", example: "diphthongs", sample: "—" },
      { symbol: "ㄱ ㄴ ㄷ ㄹ ㅁ ㅂ ㅅ ㅇ ㅈ ㅊ ㅋ ㅌ ㅍ ㅎ", example: "consonant initials", sample: "—" },
      { symbol: "ㄱ ㄴ ㄹ ㅁ ㅂ ㅇ", example: "finals (batchim)", sample: "—" },
      { symbol: "ㅲ ㄳ ㄵ ㄶ ㅀ ㅄ", example: "double consonants", sample: "—" },
    ],
  },
  {
    code: "fr",
    name: "French",
    intro: "Nasal vowels and liaison are key features.",
    phonemes: [
      { symbol: "i y u", example: "tense front vowels", sample: "si, su, lu" },
      { symbol: "e ø o", example: "tense mid vowels", sample: "—" },
      { symbol: "ɛ œ ɔ", example: "lax mid vowels", sample: "—" },
      { symbol: "a ɑ", example: "open vowels", sample: "la, patte" },
      { symbol: "ə", example: "schwa", sample: "—" },
      { symbol: "ɑ̃ ɛ̃ ɔ̃ œ̃", example: "nasal vowels", sample: "en, in, on, un" },
      { symbol: "p t k", example: "voiceless stops (un-aspirated)", sample: "—" },
      { symbol: "b d g", example: "voiced stops", sample: "—" },
      { symbol: "f s ʃ v z ʒ", example: "fricatives", sample: "—" },
      { symbol: "l ʁ j w", example: "liquids & glides", sample: "—" },
      { symbol: "n ɲ ŋ", example: "nasals", sample: "—" },
      { symbol: "wa ɥi", example: "diphthongs", sample: "—" },
    ],
  },
  {
    code: "de",
    name: "German",
    intro: "Watch out for umlauts and the voiced s/z contrast.",
    phonemes: [
      { symbol: "aː a", example: "Mann / Wagen", sample: "a, ah" },
      { symbol: "eː ɛ e", example: "See / Bett / Katze", sample: "e, eh" },
      { symbol: "iː ɪ", example: "Tier / Wirt", sample: "i, ih" },
      { symbol: "oː ɔ", example: "Ofen / Sohn", sample: "o, oh" },
      { symbol: "uː ʊ", example: "Schuh / Hund", sample: "u, uh" },
      { symbol: "øː œ", example: "schön / öffnen", sample: "ö" },
      { symbol: "yː ʏ", example: "Tür / hübsch", sample: "ü" },
      { symbol: "aɪ aʊ ɔɪ", example: "diphthongs", sample: "Ei, Au, Eu" },
      { symbol: "p b t d k g", example: "plosives", sample: "—" },
      { symbol: "f v s z ʃ ʒ x h", example: "fricatives (ch = x)", sample: "—" },
      { symbol: "m n ŋ l r", example: "nasals & liquids (r varies)", sample: "—" },
      { symbol: "pf ts tʃ", example: "affricates", sample: "—" },
    ],
  },
  {
    code: "es",
    name: "Spanish",
    intro: "Five pure vowels and rolled r.",
    phonemes: [
      { symbol: "a e i o u", example: "pure vowels", sample: "casa, mesa, vida" },
      { symbol: "p b t d k g", example: "plosives (b/d are lenis)", sample: "—" },
      { symbol: "f s x", example: "j = /x/, ll = /ʝ/ (traditional)", sample: "—" },
      { symbol: "tʃ", example: "ch", sample: "chico" },
      { symbol: "m n ɲ ŋ", example: "nasals", sample: "—" },
      { symbol: "l ʎ ɾ r", example: "l / glie / tapped / trilled", sample: "—" },
      { symbol: "eɪ aɪ oʊ", example: "diphthongs", sample: "rei, hay, lo" },
    ],
  },
  {
    code: "it",
    name: "Italian",
    intro: "Seven pure vowels (no schwa).",
    phonemes: [
      { symbol: "i e ɛ a ɔ o u", example: "seven pure vowels", sample: "—" },
      { symbol: "j w", example: "semi-vowels", sample: "—" },
      { symbol: "p b t d k g", example: "plosives", sample: "—" },
      { symbol: "f v s z ʃ ʒ", example: "fricatives", sample: "—" },
      { symbol: "tʃ dʒ", example: "affricates", sample: "—" },
      { symbol: "m n ɲ", example: "nasals (gn = /ɲ/)", sample: "—" },
      { symbol: "l ʎ r", example: "liquids (gl)", sample: "—" },
    ],
  },
  {
    code: "ru",
    name: "Russian",
    intro: "Vowel reduction; final devoicing.",
    phonemes: [
      { symbol: "a o u i", example: "vowels (reduced when unstressed)", sample: "—" },
      { symbol: "ɐ ɪ", example: "reduced vowels", sample: "—" },
      { symbol: "ɨ", example: "hard y (not in у/е)", sample: "мы" },
      { symbol: "p pʲ b bʲ", example: "labial plosives (palatalized forms)", sample: "—" },
      { symbol: "t tʲ d dʲ", example: "alveolar plosives", sample: "—" },
      { symbol: "k kʲ g gʲ", example: "velar plosives", sample: "—" },
      { symbol: "f fʲ v vʲ", example: "labial fricatives", sample: "—" },
      { symbol: "s sʲ z zʲ ɕ ʐ", example: "sibilants (ш/ж vs щ/щ')", sample: "—" },
      { symbol: "x xʲ", example: "х / (h)", sample: "ха" },
      { symbol: "ts tɕ", example: "ц / ч", sample: "—" },
      { symbol: "m n r l j", example: "sonorants", sample: "—" },
    ],
  },
  {
    code: "ar",
    name: "Arabic",
    intro: "Emphasis (pharyngealisation) is the key feature.",
    phonemes: [
      { symbol: "a i u", example: "short vowels", sample: "—" },
      { symbol: "aː iː uː", example: "long vowels", sample: "—" },
      { symbol: "b t d tʰ dʰ k q", example: "plosives (qaf emphatic)", sample: "—" },
      { symbol: "f s ɣ h", example: "fricatives (ع = ʕ)", sample: "—" },
      { symbol: "θ ð ʃ ʒ", example: "Arabic-only fricatives (ث ذ)", sample: "—" },
      { symbol: "sˤ dˤ tˤ ɮˤ", example: "emphatic sibilants (ص ض ط ظ)", sample: "—" },
      { symbol: "ʕ ħ", example: "pharyngeal (ع ح)", sample: "—" },
      { symbol: "w j m n l r", example: "sonorants (ر rolled)", sample: "—" },
    ],
  },
];

/** Find a static cheatsheet for a language code, falling back gracefully. */
export function getPhoneticSheet(code: string): LangPhonetics | undefined {
  return LANG_PHONETICS.find((l) => l.code === code);
}
