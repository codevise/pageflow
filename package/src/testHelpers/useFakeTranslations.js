import I18n from 'i18n-js';
import _ from 'underscore';

/**
 * Define translations to use in tests.
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

    if (multiLocale) {
      I18n.translations = keysWithDotsToNestedObjects(translations);
    }
    else {
      I18n.translations = {en: keysWithDotsToNestedObjects(translations)};
    }
  });

  afterEach(() => {
    I18n.translations = originalTranslations;
  });
}

function keysWithDotsToNestedObjects(translations) {
  return _(translations).reduce((result, value, key) => {
    var keys = key.split('.');
    var last = keys.pop();

    var inner = _(keys).reduce((r, key) => {
      r[key] = r[key] || {};
      return r[key];
    }, result);

    inner[last] = value;
    return result;
  }, {});
}
