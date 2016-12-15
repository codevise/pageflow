describe('pageflow.i18nUtils.attributeTranslation', function() {
  var attributeTranslation = pageflow.i18nUtils.attributeTranslation;

  describe('with prefixes option', function() {
    describe('with present prefixed attribute translation', function() {
      support.useFakeTranslations({
        'pageflow.rainbows.page_attributes.title.label': 'Rainbow Text',
        'activerecord.attributes.page.title': 'AR Text'
      });

      it('uses prefixed attribute translation', function() {
        var result = attributeTranslation('title', 'label', {
          prefixes: [
            'pageflow.rainbows.page_attributes'
          ],
          propertyName: 'title'
        });

        expect(result).to.eq('Rainbow Text');
      });
    });

    describe('with missing prefixed attribute translation', function() {
      support.useFakeTranslations({
        'activerecord.attributes.page.title': 'AR Text'
      });

      it('falls back to active record attribute translation', function() {
        var result = attributeTranslation('title', 'label', {
          prefixes: [
            'pageflow.rainbows.page_attributes'
          ],
          fallbackPrefix: 'activerecord.attributes',
          fallbackModelI18nKey: 'page'
        });

        expect(result).to.eq('AR Text');
      });
    });
  });

  describe('without prefixes option', function() {
    support.useFakeTranslations({
      'activerecord.attributes.page.title': 'AR Text'
    });

    it('uses active record attribute translation', function() {
      var result = attributeTranslation('title', 'label', {
        fallbackPrefix: 'activerecord.attributes',
        fallbackModelI18nKey: 'page',
        model: {i18nKey: 'page'}
      });

      expect(result).to.eq('AR Text');
    });
  });
});