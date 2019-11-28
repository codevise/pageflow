import I18n from 'i18n-js';
import _ from 'underscore';

export const useFakeTranslations = function(translations) {
  beforeEach(function() {
    this._originalTranslations = I18n.translations;

    var nested = _(translations).reduce(function(result, value, key) {
      var keys = key.split('.');
      var last = keys.pop();

      var inner = _(keys).reduce(function(r, key) {
        r[key] = r[key] || {};
        return r[key];
      }, result);

      inner[last] = value;
      return result;
    }, {});

    I18n.translations = {en: nested};
  });

  afterEach(() => {
    I18n.translations = this._originalTranslations;
  });
};
