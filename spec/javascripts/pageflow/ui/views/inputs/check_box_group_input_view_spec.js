describe('pageflow.CheckBoxGroupInputView', function() {
  var Model = Backbone.Model.extend({
    i18nKey: 'page'
  });

  describe('without texts option', function() {
    support.useFakeTranslations({
      'activerecord.values.page.some_attribute.one': 'One',
      'activerecord.values.page.some_attribute.two': 'Two'
    });

    it('uses activerecord values translations for items', function() {
      var checkBoxGroupInputView = new pageflow.CheckBoxGroupInputView({
        model: new Model({some_attribute: {'one': true, 'two': false}}),
        propertyName: 'some_attribute',
        values: ['one', 'two']
      });

      var texts = optionTexts(checkBoxGroupInputView);

      expect(texts).to.deep.eq(['One', 'Two']);
    });
  });

  describe('with texts option', function() {
    it('uses texts for items', function() {
      var checkBoxGroupInputView = new pageflow.CheckBoxGroupInputView({
        model: new Model({some_attribute: {'one': true, 'two': false}}),
        propertyName: 'some_attribute',
        values: [1, 2],
        texts: ['One', 'Two']
      });

      var texts = optionTexts(checkBoxGroupInputView);

      expect(texts).to.deep.eq(['One', 'Two']);
    });
  });

  function optionTexts(view) {
    view.render();

    return jQuery(view.el).find('.check_boxes_container label').map(function() {
      return jQuery(this).text();
    }).get();
  }
});