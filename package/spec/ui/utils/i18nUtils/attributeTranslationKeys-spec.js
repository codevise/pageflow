import {i18nUtils} from 'pageflow/ui';

describe('pageflow.i18nUtils.attributeTranslationKeys', () => {
  var attributeTranslationKeys = i18nUtils.attributeTranslationKeys;

  describe('without prefixes', () => {
    it(
      'constructs fallback key from fallback prefix, model i18nKey and propertyName',
      () => {
        var result = attributeTranslationKeys('title', 'label', {
          fallbackPrefix: 'activerecord.attributes',
          fallbackModelI18nKey: 'page'
        });

        expect(result).toEqual(['activerecord.attributes.page.title']);
      }
    );
  });

  describe('with prefixes', () => {
    it(
      'constructs additional candidates from prefix, propertyName and given key',
      () => {
        var result = attributeTranslationKeys('title', 'label', {
          prefixes: [
            'pageflow.rainbows.page_attributes',
            'pageflow.common_page_attributes'
          ],
          fallbackPrefix: 'activerecord.attributes',
          fallbackModelI18nKey: 'page'
        });

        expect(result).toEqual([
          'pageflow.rainbows.page_attributes.title.label',
          'pageflow.common_page_attributes.title.label',
          'activerecord.attributes.page.title'
        ]);
      }
    );
  });
});
