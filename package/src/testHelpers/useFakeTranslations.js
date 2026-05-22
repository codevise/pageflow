import I18n from 'i18n-js';
import _ from 'underscore';

/**
 * Define translations to use in tests.
 *
 * Multiple calls within the same describe block (or across nested
 * describes) compose: each call's translations are merged on top of
 * whatever previous `useFakeTranslations` calls already provided.
 *
 * @param {Object} translations -
 *   A mapping of either the form `(translation key => translated
 *   text)`.  Translation keys can contains dots.
 * @param {Object} [options]
 * @param {boolean} [options.multiLocale] -
 *   Set to `true` if keys include the locale name.
 *
 * @example
 * import {useFakeTranslations} from 'pageflow/testHelpers';
 * import I18n from 'i18n-js';
 *
 * describe('...', () => {
 *   useFakeTranslations({
 *     'some.key': 'some translation'
 *   });
 *
 *   it('...', () => {
 *     I18n.t('some.key') // => 'some translation'
 *   });
 * });
 *
 * @example
 * import {useFakeTranslations} from 'pageflow/testHelpers';
 * import I18n from 'i18n-js';
 *
 * describe('...', () => {
 *   useFakeTranslations({
 *     'en.some.key': 'some text',
 *     'de.some.key': 'etwas Text'
 *   }, {multiLocale: true});
 *
 *   it('...', () => {
 *     I18n.locale = 'de';
 *     I18n.t('some.key') // => 'etwas Text'
 *   });
 * });
 */
export function useFakeTranslations(translations, {multiLocale} = {}) {
  let originalTranslations;

  beforeEach(function() {
    originalTranslations = I18n.translations;

    const base = I18n.translations
      ? JSON.parse(JSON.stringify(I18n.translations))
      : {};

    if (multiLocale) {
      applyTranslations(base, translations);
    }
    else {
      base.en = base.en || {};
      applyTranslations(base.en, translations);
    }

    I18n.translations = base;
  });

  afterEach(() => {
    I18n.translations = originalTranslations;
  });
}

function applyTranslations(target, translations) {
  _(translations).each((value, key) => {
    const keys = key.split('.');
    const last = keys.pop();

    const inner = _(keys).reduce((r, k) => {
      r[k] = r[k] || {};
      return r[k];
    }, target);

    inner[last] = value;
  });
}
