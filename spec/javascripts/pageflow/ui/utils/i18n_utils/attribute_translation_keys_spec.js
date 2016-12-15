describe('pageflow.i18nUtils.attributeTranslationKeys', function() {
  var attributeTranslationKeys = pageflow.i18nUtils.attributeTranslationKeys;

  describe('without prefixes', function() {
    it('constructs fallback key from fallback prefix, model i18nKey and propertyName', function() {
      var result = attributeTranslationKeys('title', 'label', {
        fallbackPrefix: 'activerecord.attributes',
        fallbackModelI18nKey: 'page'
      });

      expect(result).to.deep.eq(['activerecord.attributes.page.title']);
    });
  });

  describe('with prefixes', function() {
    it('constructs additional candidates from prefix, propertyName and given key', function() {
      var result = attributeTranslationKeys('title', 'label', {
        prefixes: [
          'pageflow.rainbows.page_attributes',
          'pageflow.common_page_attributes'
        ],
        fallbackPrefix: 'activerecord.attributes',
        fallbackModelI18nKey: 'page'
      });

      expect(result).to.deep.eq([
        'pageflow.rainbows.page_attributes.title.label',
        'pageflow.common_page_attributes.title.label',
        'activerecord.attributes.page.title'
      ]);
    });
  });
});
