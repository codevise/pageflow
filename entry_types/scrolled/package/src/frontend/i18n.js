import I18n from 'i18n-js';

export function setupI18n({defaultLocale, locale, translations}) {
  I18n.defaultLocale = defaultLocale;
  I18n.locale = locale;
  I18n.translations = translations;
}
