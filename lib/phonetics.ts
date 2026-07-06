/**
 * Convert Arpabet notation (as returned by Datamuse with `md=r`) to IPA.
 * This is a curated subset that covers the most common English phonemes.
 *
 * Datamuse format example:   ah1.nuh0.d -> ə.ˈnʌd  (approximate)
 * Arpabet numbers: 0 = no stress, 1 = primary stress, 2 = secondary stress.
 * Vowels come in stressed (with 1 or 2) and unstressed (with 0) variants.
 */

const ARPABET_VOWELS: Record<string, string> = {
  AA: "ɑ",
  AE: "æ",
  AH: "ʌ", // unstressed; "ɑ" if stressed at 1/2 — handled below
  AO: "ɔ",
  AW: "aʊ",
  AY: "aɪ",
  EH: "ɛ",
  ER: "ɜr",
  EY: "eɪ",
  IH: "ɪ",
  IY: "iː",
  OW: "oʊ",
  OY: "ɔɪ",
  UH: "ʊ",
  UW: "uː",
  AX: "ə",
};

const ARPABET_CONSONANTS: Record<string, string> = {
  B: "b",
  CH: "tʃ",
  D: "d",
  DH: "ð",
  F: "f",
  G: "ɡ",
  HH: "h",
  JH: "dʒ",
  K: "k",
  L: "l",
  M: "m",
  N: "n",
  NG: "ŋ",
  P: "p",
  R: "r",
  S: "s",
  SH: "ʃ",
  T: "t",
  TH: "θ",
  V: "v",
  W: "w",
  Y: "j",
  Z: "z",
  ZH: "ʒ",
};

interface Token {
  /** Stress: 1 = primary, 2 = secondary, 0 = unstressed */
  stress: number;
  /** ARPAbet phoneme */
  phone: string;
}

/**
 * Parse a Datamuse `pron` string like "AE1 N AH0 L" into tokens.
 * Returns null if the string cannot be parsed cleanly.
 */
export function parseArpabet(pron: string): Token[] | null {
  if (!pron) return null;
  const tokens: Token[] = [];
  // Vowels carry a stress digit (0/1/2); consonants do not.
  // Match either "LETTERS + digit" (vowel) or "LETTERS" (consonant).
  const tokenPattern = /([A-Z]+)([012])?(?=\s|$)/g;
  let match: RegExpExecArray | null;
  while ((match = tokenPattern.exec(pron)) !== null) {
    tokens.push({
      phone: match[1],
      stress: match[2] !== undefined ? Number(match[2]) : 0,
    });
  }
  return tokens.length > 0 ? tokens : null;
}

/**
 * Convert a sequence of parsed Arpabet tokens into a readable IPA string.
 *
 * IPA stress marks go at the START of the stressed syllable, i.e. before the
 * consonant cluster that leads into the stressed vowel (the syllable onset).
 *
 * Algorithm:
 *   - Accumulate consonants into a buffer between vowels.
 *   - When we hit a stressed vowel (stress 1 or 2), insert the stress mark
 *     BEFORE the buffered onset consonants, then flush them.
 *   - When we hit an unstressed vowel, just flush the buffer normally.
 */
export function arpabetToIpa(tokens: Token[]): string {
  // IPA for each token (consonants and vowels)
  const mapped: Array<{ kind: "C" | "V"; ipa: string; stress: number }> = [];

  for (const t of tokens) {
    const csym = ARPABET_CONSONANTS[t.phone];
    if (csym) {
      mapped.push({ kind: "C", ipa: csym, stress: 0 });
      continue;
    }
    const vsym = ARPABET_VOWELS[t.phone];
    if (vsym) {
      // AH unstressed → ə (schwa), AH stressed → ɑ
      const ipa = t.phone === "AH" && t.stress > 0 ? "ɑ" : vsym;
      mapped.push({ kind: "V", ipa, stress: t.stress });
      continue;
    }
    mapped.push({ kind: "C", ipa: t.phone.toLowerCase(), stress: 0 });
  }

  const out: string[] = [];
  let consonantBuf: string[] = [];

  for (let i = 0; i < mapped.length; i++) {
    const tok = mapped[i];
    if (tok.kind === "C") {
      consonantBuf.push(tok.ipa);
    } else {
      // Vowel — determine stress mark
      const mark = tok.stress === 1 ? "ˈ" : tok.stress === 2 ? "ˌ" : "";
      if (mark) {
        // Stress mark goes before the onset (buffered consonants)
        out.push(mark);
      }
      out.push(...consonantBuf);
      consonantBuf = [];
      out.push(tok.ipa);
    }
  }

  // Flush any trailing consonants (e.g. coda of final syllable)
  out.push(...consonantBuf);

  return out.join("");
}

/**
 * Convenience: take a Datamuse-style Arpabet pron string and return IPA,
 * or null if the input is unparseable.
 */
export function arpabetStringToIpa(pron: string): string | null {
  const tokens = parseArpabet(pron);
  if (!tokens) return null;
  return arpabetToIpa(tokens);
}

/**
 * Wrap an IPA transcription in slashes (phonemic transcription convention).
 */
export function wrapSlashes(ipa: string): string {
  return `/${ipa}/`;
}
