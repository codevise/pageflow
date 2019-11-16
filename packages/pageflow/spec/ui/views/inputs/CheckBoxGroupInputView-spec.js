import Backbone from 'backbone';

import {CheckBoxGroupInputView} from '$pageflow/ui';

import * as support from '$support';

describe('pageflow.CheckBoxGroupInputView', () => {
  var Model = Backbone.Model.extend({
    i18nKey: 'page'
  });

  describe('without texts option', () => {
    support.useFakeTranslations({
      'activerecord.values.page.some_attribute.one': 'One',
      'activerecord.values.page.some_attribute.two': 'Two'
    });

    test('uses activerecord values translations for items', () => {
      var checkBoxGroupInputView = new CheckBoxGroupInputView({
        model: new Model({some_attribute: {'one': true, 'two': false}}),
        propertyName: 'some_attribute',
        values: ['one', 'two']
      });

      var texts = optionTexts(checkBoxGroupInputView);

      expect(texts).toEqual(['One', 'Two']);
    });
  });

  describe('with texts option', () => {
    test('uses texts for items', () => {
      var checkBoxGroupInputView = new CheckBoxGroupInputView({
        model: new Model({some_attribute: {'one': true, 'two': false}}),
        propertyName: 'some_attribute',
        values: [1, 2],
        texts: ['One', 'Two']
      });

      var texts = optionTexts(checkBoxGroupInputView);

      expect(texts).toEqual(['One', 'Two']);
    });
  });

  function optionTexts(view) {
    view.render();

    return jQuery(view.el).find('.check_boxes_container label').map(function() {
      return jQuery(this).text();
    }).get();
  }
});