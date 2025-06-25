import $ from 'jquery';
import Backbone from 'backbone';

import {SelectInputView} from 'pageflow/ui';

import * as support from '$support';

describe('pageflow.SelectInputView', () => {
  var Model = Backbone.Model.extend({
    i18nKey: 'page'
  });

  it('loads value', () => {
    var model = new Model({value: 'second'});
    var selectInputView = new SelectInputView({
      model: model,
      propertyName: 'value',
      values: ['first', 'second']
    });

    selectInputView.render();

    expect($('select', selectInputView.el).val()).toEqual('second');
  });

  it('saves value on change', () => {
    var model = new Model();
    var selectInputView = new SelectInputView({
      model: model,
      propertyName: 'value',
      values: ['first', 'second']
    });

    selectInputView.render();
    selectInputView.ui.select.val('second');
    selectInputView.ui.select.trigger('change');

    expect(model.get('value')).toEqual('second');
  });

  it('selects first option if value is not among values', () => {
    var model = new Model({value: 'not there'});
    var selectInputView = new SelectInputView({
      model: model,
      propertyName: 'value',
      values: ['first', 'second']
    });

    selectInputView.render();

    expect($('select', selectInputView.el).val()).toEqual('first');
  });

  describe('without texts option', () => {
    support.useFakeTranslations({
      'activerecord.values.page.modes.one': 'One',
      'activerecord.values.page.modes.two': 'Two'
    });

    it('uses activerecord values translations for item', () => {
      var selectInputView = new SelectInputView({
        model: new Model(),
        propertyName: 'modes',
        values: ['one', 'two']
      });

      var texts = optionTexts(selectInputView);

      expect(texts).toEqual(['One', 'Two']);
    });
  });

  describe('with texts option', () => {
    it('uses texts for items', () => {
      var selectInputView = new SelectInputView({
        model: new Model(),
        propertyName: 'size',
        values: [1, 2],
        texts: ['One', 'Two']
      });

      var texts = optionTexts(selectInputView);

      expect(texts).toEqual(['One', 'Two']);
    });
  });

  describe('with translationKeys option', () => {
    support.useFakeTranslations({
      'items.one': 'One',
      'items.two': 'Two'
    });

    it('uses translations for items', () => {
      var selectInputView = new SelectInputView({
        model: new Model(),
        propertyName: 'size',
        values: [1, 2],
        translationKeys: ['items.one', 'items.two']
      });

      var texts = optionTexts(selectInputView);

      expect(texts).toEqual(['One', 'Two']);
    });
  });

  describe('with translationKeyPrefix option', () => {
    support.useFakeTranslations({
      'items.one': 'One',
      'items.two': 'Two'
    });

    it('uses translation keys from values for items', () => {
      var selectInputView = new SelectInputView({
        model: new Model(),
        propertyName: 'modes',
        values: ['one', 'two'],
        translationKeyPrefix: 'items'
      });

      var texts = optionTexts(selectInputView);

      expect(texts).toEqual(['One', 'Two']);
    });
  });

  describe('with attributeTranslationKeyPrefixes option', () => {
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

    it('uses attribute values translation keys', () => {
      var selectInputView = new SelectInputView({
        model: new Model(),
        propertyName: 'modes',
        values: ['one', 'two'],
        attributeTranslationKeyPrefixes: ['some.attributes']
      });

      var texts = optionTexts(selectInputView);

      expect(texts).toEqual(['One', 'Two']);
    });

    it('prefers first attribute translation key prefix', () => {
      var selectInputView = new SelectInputView({
        model: new Model(),
        propertyName: 'modes',
        values: ['one', 'two'],
        attributeTranslationKeyPrefixes: ['some.attributes', 'fallback.attributes']
      });

      var texts = optionTexts(selectInputView);

      expect(texts).toEqual(['One', 'Two']);
    });

    it('falls back to second attribute translation key prefix', () => {
      var selectInputView = new SelectInputView({
        model: new Model(),
        propertyName: 'fallback',
        values: ['one', 'two'],
        attributeTranslationKeyPrefixes: ['some.attributes', 'fallback.attributes']
      });

      var texts = optionTexts(selectInputView);

      expect(texts).toEqual(['Fallback One', 'Fallback Two']);
    });

    it('falls back active record values translations', () => {
      var selectInputView = new SelectInputView({
        model: new Model(),
        propertyName: 'legacy',
        values: ['one', 'two'],
        attributeTranslationKeyPrefixes: ['some.attributes', 'fallback.attributes']
      });

      var texts = optionTexts(selectInputView);

      expect(texts).toEqual(['AR One', 'AR Two']);
    });
  });

  describe('without ensureValueDefined option', () => {
    it('does not assign value when rendered', () => {
      var model = new Model();
      var selectInputView = new SelectInputView({
        model: model,
        propertyName: 'value',
        values: ['one', 'two']
      });

      selectInputView.render();

      expect(model.has('value')).toBe(false);
    });
  });

  describe('with ensureValueDefined option', () => {
    it('assigns value of first option when rendered', () => {
      var model = new Model();
      var selectInputView = new SelectInputView({
        model: model,
        propertyName: 'value',
        values: ['one', 'two'],
        ensureValueDefined: true
      });

      selectInputView.render();

      expect(model.get('value')).toBe('one');
    });
  });

  describe('with optionDisabled option', () => {
    it('disables options for which function returns true', () => {
      var model = new Model();
      var selectInputView = new SelectInputView({
        model: model,
        propertyName: 'value',
        values: ['one', 'two'],
        optionDisabled: value => value === 'two'
      });

      selectInputView.render();

      expect($('option', selectInputView.el).length).toBe(2);
      expect($('option[disabled]', selectInputView.el).length).toBe(1);
      expect($('option[disabled]', selectInputView.el)).toHaveAttr('value', 'two');
    });

    it('selects first non disabled option if value option is disabled', () => {
      var model = new Model({value: 'disabled'});
      var selectInputView = new SelectInputView({
        model: model,
        propertyName: 'value',
        values: ['disabled', 'available'],
        optionDisabled: value => value === 'disabled'
      });

      selectInputView.render();

      expect($('select', selectInputView.el).val()).toEqual('available');
    });
  });

  describe('with defaultValue', () => {
    it('selects default value if property is not set', () => {
      var model = new Model();
      var selectInputView = new SelectInputView({
        model: model,
        propertyName: 'value',
        values: ['small', 'medium', 'large'],
        defaultValue: 'medium'
      });

      selectInputView.render();

      expect($('select', selectInputView.el).val()).toEqual('medium');
    });

    it('selects current value if property is set', () => {
      var model = new Model({value: 'small'});
      var selectInputView = new SelectInputView({
        model: model,
        propertyName: 'value',
        values: ['small', 'medium', 'large'],
        defaultValue: 'medium'
      });

      selectInputView.render();

      expect($('select', selectInputView.el).val()).toEqual('small');
    });

    it('does not save default value', () => {
      var model = new Model({value: 'small'});
      var selectInputView = new SelectInputView({
        model: model,
        propertyName: 'value',
        values: ['small', 'medium', 'large'],
        defaultValue: 'medium'
      });

      selectInputView.render();
      selectInputView.ui.select.val('medium');
      selectInputView.ui.select.trigger('change');

      expect(model.has('value')).toEqual(false);
    });

    it('saves other values on change', () => {
      var model = new Model({value: 'small'});
      var selectInputView = new SelectInputView({
        model: model,
        propertyName: 'value',
        values: ['small', 'medium', 'large'],
        defaultValue: 'medium'
      });

      selectInputView.render();
      selectInputView.ui.select.val('large');
      selectInputView.ui.select.trigger('change');

      expect(model.get('value')).toEqual('large');
    });
  });

  describe('with includeBlank option', () => {
    describe('with attributeTranslationKeyPrefixes option', () => {
      support.useFakeTranslations({
        'some.attributes.modes.blank': 'Custom None',
        'fallback.attributes.modes.blank': 'Fallback None',
        'pageflow.ui.views.inputs.select_input_view.none': 'Default None'
      });

      it('uses blank translation from attribute translation key prefixes', () => {
        var selectInputView = new SelectInputView({
          model: new Model(),
          propertyName: 'modes',
          values: ['one', 'two'],
          includeBlank: true,
          attributeTranslationKeyPrefixes: ['some.attributes']
        });

        selectInputView.render();
        var blankOptionText = $('option[value=""]', selectInputView.el).text();

        expect(blankOptionText).toEqual('Custom None');
      });

      it('falls back to second attribute translation key prefix for blank', () => {
        var selectInputView = new SelectInputView({
          model: new Model(),
          propertyName: 'modes',
          values: ['one', 'two'],
          includeBlank: true,
          attributeTranslationKeyPrefixes: ['missing.attributes', 'fallback.attributes']
        });

        selectInputView.render();
        var blankOptionText = $('option[value=""]', selectInputView.el).text();

        expect(blankOptionText).toEqual('Fallback None');
      });

      it('falls back to default translation when no attribute blank key exists', () => {
        var selectInputView = new SelectInputView({
          model: new Model(),
          propertyName: 'nonexistent',
          values: ['one', 'two'],
          includeBlank: true,
          attributeTranslationKeyPrefixes: ['some.attributes']
        });

        selectInputView.render();
        var blankOptionText = $('option[value=""]', selectInputView.el).text();

        expect(blankOptionText).toEqual('Default None');
      });

      it('prefers explicit blankText over attribute translation key prefixes', () => {
        var selectInputView = new SelectInputView({
          model: new Model(),
          propertyName: 'modes',
          values: ['one', 'two'],
          includeBlank: true,
          blankText: 'Explicit None',
          attributeTranslationKeyPrefixes: ['some.attributes']
        });

        selectInputView.render();
        var blankOptionText = $('option[value=""]', selectInputView.el).text();

        expect(blankOptionText).toEqual('Explicit None');
      });

      describe('with explicit blankTranslationKey', () => {
        support.useFakeTranslations({
          'explicit.blank': 'Explicit Translation None',
          'some.attributes.modes.blank': 'Custom None'
        });

        it('prefers explicit blankTranslationKey over attribute translation key prefixes', () => {
          var selectInputView = new SelectInputView({
            model: new Model(),
            propertyName: 'modes',
            values: ['one', 'two'],
            includeBlank: true,
            blankTranslationKey: 'explicit.blank',
            attributeTranslationKeyPrefixes: ['some.attributes']
          });

          selectInputView.render();
          var blankOptionText = $('option[value=""]', selectInputView.el).text();

          expect(blankOptionText).toEqual('Explicit Translation None');
        });
      });
    });
  });

  function optionTexts(view) {
    view.render();

    return $(view.el).find('option').map(function() {
      return $(this).text();
    }).get();
  }
});
