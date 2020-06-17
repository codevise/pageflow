import React, {useContext, createContext} from 'react';
import I18n from 'i18n-js';
import {useEntryMetadata} from '../entryState';

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

export function useLocale() {
  return useContext(LocaleContext);
}

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
 * @param {string} [locale="entry"] -
 *   Pass `"ui"` to use the locale of the editor interface instead.
 *
 * @example
 * const {t} = useI18n();
 * t('pageflow_scrolled.public.some.key')
 *
 * const {t} = useI18n({locale: 'ui'});
 * t('pageflow_scrolled.inline_editing.some.key')
 */
export function useI18n({locale: scope} = {}) {
  const locale = useLocale();

  return {
    t(key, options) {
      return I18n.t(key, {...options, locale: scope !== 'ui' && locale})
    }
  };
}
