import React, {useContext, createContext} from 'react';
import I18n from 'i18n-js';
import {useEntryMetadata} from 'pageflow-scrolled/entryState';

const LocaleContext = createContext('en');

export function setupI18n({defaultLocale, locale, translations}) {
  I18n.defaultLocale = defaultLocale;
  I18n.locale = locale;
  I18n.translations = translations;
}

export function LocaleProvider({children}) {
  const {locale} = useEntryMetadata() || {};

  return (
    <LocaleContext.Provider value={locale}>
      {children}
    </LocaleContext.Provider>
  );
}

/**
 * Obtain a locale to translate or format data in. Returns the
 * configured locale of the current entry by default.
 *
 * Elements that are rendered on top of the entry in the editor
 * preview or while reviewing an entry are part of the user interface
 * rather than of the entry itself. Pass `"ui"` as `locale` option to
 * obtain the locale of the user interface for those.
 *
 * @param {Object} [options]
 * @param {"entry"|"ui"} [options.locale="entry"] -
 *   Pass `"ui"` to obtain the locale of the user interface instead.
 *   Note that this option selects which of the two locales to use. It
 *   does not take a locale name.
 *
 * @example
 * const locale = useLocale();
 * date.toLocaleDateString(locale)
 *
 * const locale = useLocale({locale: 'ui'});
 */
export function useLocale({locale: scope = 'entry'} = {}) {
  const entryLocale = useContext(LocaleContext);

  if (!localeScopes.includes(scope)) {
    throw new Error(
      `Unknown locale option '${scope}'. Pass either ${localeScopes.join(' or ')}.`
    );
  }

  return scope === 'ui' ? I18n.currentLocale() : entryLocale;
}

const localeScopes = ['entry', 'ui'];

/**
 * Use translations in frontend elements. Uses the configured locale
 * of the current entry by default. Note that only translation keys
 * from the `pageflow_scrolled.public` scope are universally
 * available.
 *
 * to render translations for inline editing controls in the editor
 * preview, you can pass `"ui"` as `locale` option and use
 * translations from the `pageflow_scrolled.inline_editing` scope.
 *
 * @param {Object} [options]
 * @param {"entry"|"ui"} [options.locale="entry"] -
 *   Pass `"ui"` to use the locale of the user interface instead. Note
 *   that this option selects which of the two locales to use. It does
 *   not take a locale name.
 *
 * @example
 * const {t} = useI18n();
 * t('pageflow_scrolled.public.some.key')
 *
 * const {t} = useI18n({locale: 'ui'});
 * t('pageflow_scrolled.inline_editing.some.key')
 */
export function useI18n(options) {
  const locale = useLocale(options);

  return {
    t(key, translateOptions) {
      return I18n.t(key, {...translateOptions, locale})
    }
  };
}
