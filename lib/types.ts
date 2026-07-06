export interface Language {
  code: string;
  name: string;
}

export interface Block {
  id: string;
  langCode: string;
  text: string;
  isLoading: boolean;
  error: string | null;
  detectedLang?: string;
  phonetics?: string;
}

export interface TranslateRequest {
  q: string;
  source: string;
  targets: string[];
}

export interface TranslateResponse {
  translations: Record<string, string>;
  detectedLanguage?: string;
}

export interface LanguagesResponse {
  languages: Language[];
}
