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

  describe('when called multiple times', () => {
    useFakeTranslations({
      'some.key': 'first text'
    });

    useFakeTranslations({
      'other.key': 'other text'
    });

    it('merges translations from all calls', () => {
      expect(I18n.t('some.key')).toEqual('first text');
      expect(I18n.t('other.key')).toEqual('other text');
    });
  });

  describe('when later call overrides earlier value', () => {
    useFakeTranslations({
      'shared.key': 'first'
    });

    useFakeTranslations({
      'shared.key': 'second'
    });

    it('uses the later value', () => {
      expect(I18n.t('shared.key')).toEqual('second');
    });
  });
});
