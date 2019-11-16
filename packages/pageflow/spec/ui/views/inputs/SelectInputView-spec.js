describe('pageflow.SelectInputView', function() {
  var Model = Backbone.Model.extend({
    i18nKey: 'page'
  });

  describe('without texts option', function() {
    support.useFakeTranslations({
      'activerecord.values.page.modes.one': 'One',
      'activerecord.values.page.modes.two': 'Two'
    });

    it('uses activerecord values translations for item', function() {
      var selectInputView = new pageflow.SelectInputView({
        model: new Model(),
        propertyName: 'modes',
        values: ['one', 'two']
      });

      var texts = optionTexts(selectInputView);

      expect(texts).to.deep.eq(['One', 'Two']);
    });
  });

  describe('with texts option', function() {
    it('uses texts for items', function() {
      var selectInputView = new pageflow.SelectInputView({
        model: new Model(),
        propertyName: 'size',
        values: [1, 2],
        texts: ['One', 'Two']
      });

      var texts = optionTexts(selectInputView);

      expect(texts).to.deep.eq(['One', 'Two']);
    });
  });

  describe('with translationKeys option', function() {
    support.useFakeTranslations({
      'items.one': 'One',
      'items.two': 'Two'
    });

    it('uses translations for items', function() {
      var selectInputView = new pageflow.SelectInputView({
        model: new Model(),
        propertyName: 'size',
        values: [1, 2],
        translationKeys: ['items.one', 'items.two']
      });

      var texts = optionTexts(selectInputView);

      expect(texts).to.deep.eq(['One', 'Two']);
    });
  });

  describe('with translationKeyPrefix option', function() {
    support.useFakeTranslations({
      'items.one': 'One',
      'items.two': 'Two'
    });

    it('uses translation keys from values for items', function() {
      var selectInputView = new pageflow.SelectInputView({
        model: new Model(),
        propertyName: 'modes',
        values: ['one', 'two'],
        translationKeyPrefix: 'items'
      });

      var texts = optionTexts(selectInputView);

      expect(texts).to.deep.eq(['One', 'Two']);
    });
  });

  describe('with attributeTranslationKeyPrefixes option', function() {
    support.useFakeTranslations({
      'some.attributes.modes.values.one': 'One',
      'some.attributes.modes.values.two': 'Two',
      'fallback.attributes.modes.values.one': 'Fallback One',
      'fallback.attributes.modes.values.two': 'Fallback Two',

      'fallback.attributes.fallback.values.one': 'Fallback One',
      'fallback.attributes.fallback.values.two': 'Fallback Two',

      'activerecord.values.page.legacy.one': 'AR One',
      'activerecord.values.page.legacy.two': 'AR Two'
    });

    it('uses attribute values translation keys', function() {
      var selectInputView = new pageflow.SelectInputView({
        model: new Model(),
        propertyName: 'modes',
        values: ['one', 'two'],
        attributeTranslationKeyPrefixes: ['some.attributes']
      });

      var texts = optionTexts(selectInputView);

      expect(texts).to.deep.eq(['One', 'Two']);
    });

    it('prefers first attribute translation key prefix', function() {
      var selectInputView = new pageflow.SelectInputView({
        model: new Model(),
        propertyName: 'modes',
        values: ['one', 'two'],
        attributeTranslationKeyPrefixes: ['some.attributes', 'fallback.attributes']
      });

      var texts = optionTexts(selectInputView);

      expect(texts).to.deep.eq(['One', 'Two']);
    });

    it('falls back to second attribute translation key prefix', function() {
      var selectInputView = new pageflow.SelectInputView({
        model: new Model(),
        propertyName: 'fallback',
        values: ['one', 'two'],
        attributeTranslationKeyPrefixes: ['some.attributes', 'fallback.attributes']
      });

      var texts = optionTexts(selectInputView);

      expect(texts).to.deep.eq(['Fallback One', 'Fallback Two']);
    });

    it('falls back active record values translations', function() {
      var selectInputView = new pageflow.SelectInputView({
        model: new Model(),
        propertyName: 'legacy',
        values: ['one', 'two'],
        attributeTranslationKeyPrefixes: ['some.attributes', 'fallback.attributes']
      });

      var texts = optionTexts(selectInputView);

      expect(texts).to.deep.eq(['AR One', 'AR Two']);
    });
  });

  describe('without ensureValueDefined option', function() {
    it('does not assign value when rendered', function() {
      var model = new Model();
      var selectInputView = new pageflow.SelectInputView({
        model: model,
        propertyName: 'value',
        values: ['one', 'two']
      });

      selectInputView.render();

      expect(model.has('value')).to.eq(false);
    });
  });

  describe('with ensureValueDefined option', function() {
    it('assigns value of first option when rendered', function() {
      var model = new Model();
      var selectInputView = new pageflow.SelectInputView({
        model: model,
        propertyName: 'value',
        values: ['one', 'two'],
        ensureValueDefined: true
      });

      selectInputView.render();

      expect(model.get('value')).to.eq('one');
    });
  });

  function optionTexts(view) {
    view.render();

    return jQuery(view.el).find('option').map(function() {
      return jQuery(this).text();
    }).get();
  }
});