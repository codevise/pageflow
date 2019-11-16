import {i18nUtils} from '$pageflow/ui';

import * as support from '$support';

describe('pageflow.i18nUtils.attributeTranslation', () => {
  var attributeTranslation = i18nUtils.attributeTranslation;

  describe('with prefixes option', () => {
    describe('with present prefixed attribute translation', () => {
      support.useFakeTranslations({
        'pageflow.rainbows.page_attributes.title.label': 'Rainbow Text',
        'activerecord.attributes.page.title': 'AR Text'
      });

      test('uses prefixed attribute translation', () => {
        var result = attributeTranslation('title', 'label', {
          prefixes: [
            'pageflow.rainbows.page_attributes'
          ],
          propertyName: 'title'
        });

        expect(result).toBe('Rainbow Text');
      });
    });

    describe('with missing prefixed attribute translation', () => {
      support.useFakeTranslations({
        'activerecord.attributes.page.title': 'AR Text'
      });

      test('falls back to active record attribute translation', () => {
        var result = attributeTranslation('title', 'label', {
          prefixes: [
            'pageflow.rainbows.page_attributes'
          ],
          fallbackPrefix: 'activerecord.attributes',
          fallbackModelI18nKey: 'page'
        });

        expect(result).toBe('AR Text');
      });
    });
  });

  describe('without prefixes option', () => {
    support.useFakeTranslations({
      'activerecord.attributes.page.title': 'AR Text'
    });

    test('uses active record attribute translation', () => {
      var result = attributeTranslation('title', 'label', {
        fallbackPrefix: 'activerecord.attributes',
        fallbackModelI18nKey: 'page',
        model: {i18nKey: 'page'}
      });

      expect(result).toBe('AR Text');
    });
  });
});