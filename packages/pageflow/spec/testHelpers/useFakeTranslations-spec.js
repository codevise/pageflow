import {useFakeTranslations} from 'testHelpers/useFakeTranslations';

import I18n from 'i18n-js';

describe('useFakeTranslations', () => {
  describe('without options', () => {
    useFakeTranslations({
      'some.key': 'some text'
    });

    it('replaces translations available via i18n-js', () => {
      expect(I18n.t('some.key')).toEqual('some text');
    });
  });

  describe('with multiLocale option', () => {
    useFakeTranslations({
      'en.some.key': 'some text'
    }, {multiLocale: true});

    it('expects locale name in key', () => {
      expect(I18n.t('some.key')).toEqual('some text');
    });
  });
});
