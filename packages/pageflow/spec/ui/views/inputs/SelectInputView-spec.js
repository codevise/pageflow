import Backbone from 'backbone';

import {SelectInputView} from '$pageflow/ui';

import * as support from '$support';

describe('pageflow.SelectInputView', () => {
  var Model = Backbone.Model.extend({
    i18nKey: 'page'
  });

  describe('without texts option', () => {
    support.useFakeTranslations({
      'activerecord.values.page.modes.one': 'One',
      'activerecord.values.page.modes.two': 'Two'
    });

    test('uses activerecord values translations for item', () => {
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
    test('uses texts for items', () => {
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

    test('uses translations for items', () => {
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

    test('uses translation keys from values for items', () => {
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

    test('uses attribute values translation keys', () => {
      var selectInputView = new SelectInputView({
        model: new Model(),
        propertyName: 'modes',
        values: ['one', 'two'],
        attributeTranslationKeyPrefixes: ['some.attributes']
      });

      var texts = optionTexts(selectInputView);

      expect(texts).toEqual(['One', 'Two']);
    });

    test('prefers first attribute translation key prefix', () => {
      var selectInputView = new SelectInputView({
        model: new Model(),
        propertyName: 'modes',
        values: ['one', 'two'],
        attributeTranslationKeyPrefixes: ['some.attributes', 'fallback.attributes']
      });

      var texts = optionTexts(selectInputView);

      expect(texts).toEqual(['One', 'Two']);
    });

    test('falls back to second attribute translation key prefix', () => {
      var selectInputView = new SelectInputView({
        model: new Model(),
        propertyName: 'fallback',
        values: ['one', 'two'],
        attributeTranslationKeyPrefixes: ['some.attributes', 'fallback.attributes']
      });

      var texts = optionTexts(selectInputView);

      expect(texts).toEqual(['Fallback One', 'Fallback Two']);
    });

    test('falls back active record values translations', () => {
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
    test('does not assign value when rendered', () => {
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
    test('assigns value of first option when rendered', () => {
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

  function optionTexts(view) {
    view.render();

    return jQuery(view.el).find('option').map(function() {
      return jQuery(this).text();
    }).get();
  }
});