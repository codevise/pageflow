pageflow.i18nUtils = {
  findTranslation: function(keys, options) {
    options = options || {};

    return _.chain(keys).reverse().reduce(function(result, key) {
      return I18n.t(key, {defaultValue: result});
    }, options.defaultValue).value();
  },

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