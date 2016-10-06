/**
 * Helpers functions for handling translations.
 *
 * @memberof module:pageflow/ui
 */
pageflow.i18nUtils = {
  /**
   * Find the first key for which a translation exists and return the
   * translation.
   *
   * @param {string[]} keys
   *   Translation key candidates.
   *
   * @param {string} [options.defaultValue]
   *   Value to return if non of the keys has a translation.
   *
   * @return {string}
   */
  findTranslation: function(keys, options) {
    options = options || {};

    return _.chain(keys).reverse().reduce(function(result, key) {
      return I18n.t(key, {defaultValue: result});
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
