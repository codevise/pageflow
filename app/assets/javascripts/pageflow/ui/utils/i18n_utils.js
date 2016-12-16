/**
 * Helpers functions for handling translations.
 *
 * @memberof module:pageflow/ui
 */
pageflow.i18nUtils = {
  /**
   * Returns an array of translation keys based on the `prefixes`
   * option and the given `keyName`.
   *
   * @param {string} keyName
   *   Suffix to append to prefixes.
   *
   * @param {string[]} [options.prefixes]
   *   Array of translation key prefixes.
   *
   * @param {string} [options.fallbackPrefix]
   *   Optional additional prefix to form a model based translation
   *   key of the form
   *   `prefix.fallbackModelI18nKey.propertyName.keyName`.
   *
   * @param {string} [options.fallbackModelI18nKey]
   *   Required if `fallbackPrefix` option is present.
   *
   * @return {string[]}
   * @since edge
   */
  attributeTranslationKeys: function(attributeName, keyName, options) {
    var result = [];

    if (options.prefixes) {
      result = result.concat(_(options.prefixes).map(function(prefix) {
        return prefix + '.' + attributeName + '.' + keyName;
      }, this));
    }

    if (options && options.fallbackPrefix) {
      result.push(options.fallbackPrefix + '.' +
                  options.fallbackModelI18nKey + '.' +
                  attributeName);
    }

    return result;
  },

  /**
   * Takes the same parameters as {@link
   * module:pageflow/ui.pageflow.i18nUtils.attributeTranslationKeys
   * i18nUtils.attributeTranslationKeys}, but returns the first
   * existing translation.
   *
   * @return {string}
   * @since edge
   */
  attributeTranslation: function(attributeName, keyName, options) {
    return pageflow.i18nUtils.findTranslation(
      this.attributeTranslationKeys(attributeName, keyName, options)
    );
  },

  /**
   * Find the first key for which a translation exists and return the
   * translation.
   *
   * @param {string[]} keys
   *   Translation key candidates.
   *
   * @param {string} [options.defaultValue]
   *   Value to return if none of the keys has a translation. Is
   *   treated like an HTML translation if html flag is set.
   *
   * @param {boolean} [options.html]
   *   If true, also search for keys ending in '_html' and HTML-escape
   *   keys that do not end in 'html'
   *
   * @return {string}
   */
  findTranslation: function(keys, options) {
    options = options || {};

    if (options.html) {
      keys = this.translationKeysWithSuffix(keys, 'html');
    }

    return _.chain(keys).reverse().reduce(function(result, key) {
      var unescapedTranslation = I18n.t(key, _.extend({}, options, {defaultValue: result}));
      if (!options.html || key.match(/_html$/) || result == unescapedTranslation) {
        return unescapedTranslation;
      }
      else {
        return $('<div />').text(unescapedTranslation).html();
      }
    }, options.defaultValue).value();
  },

  /**
   * Return the first key for which a translation exists. Returns the
   * first if non of the keys has a translation.
   *
   * @param {string[]} keys
   * Translation key candidates.
   *
   * @return {string}
   */
  findKeyWithTranslation: function(keys) {
    var missing = '_not_translated';

    return _(keys).detect(function(key) {
      return I18n.t(key, {defaultValue: missing}) !== missing;
    }) || _.first(keys);
  },

  translationKeysWithSuffix: function(keys, suffix) {
    return _.chain(keys).map(function(key) {
      return [key + '_' + suffix, key];
    }).flatten().value();
  }
};
