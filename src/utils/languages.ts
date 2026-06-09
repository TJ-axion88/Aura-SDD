export const supportedLanguages = [
  'en', 'ja', 'zh-TW', 'zh', 'es', 'pt', 'de', 'fr', 'ru', 'it', 'ko', 'ar', 'el',
] as const;

export type SupportedLanguage = (typeof supportedLanguages)[number];

export const languageNames: Record<SupportedLanguage, string> = {
  en: 'English',
  ja: '日本語',
  'zh-TW': '繁體中文',
  zh: '简体中文',
  es: 'Español',
  pt: 'Português',
  de: 'Deutsch',
  fr: 'Français',
  ru: 'Русский',
  it: 'Italiano',
  ko: '한국어',
  ar: 'العربية',
  el: 'Ελληνικά',
};
