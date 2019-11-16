import Backbone from 'backbone';

import {TabsView} from '$pageflow/ui';

import * as support from '$support';

describe('TabsView', () => {
  describe('with i18n option', () => {
    support.useFakeTranslations({
      'tabs.one': 'Tab one',
      'tabs.two': 'Tab two'
    });

    test('uses prefix for tab labels', () => {
      var tabsView = new TabsView({
        i18n: 'tabs'
      });

      tabsView.tab('one', function() { return new Backbone.View(); });
      tabsView.tab('two', function() { return new Backbone.View(); });

      var tabs = support.dom.Tabs.render(tabsView);

      expect(tabs.tabLabels()).toEqual(['Tab one', 'Tab two']);
    });
  });

  describe('with fallbackTranslationKeyPrefix option', () => {
    support.useFakeTranslations({
      'tabs.one': 'Tab one',
      'tabs.two': 'Tab two'
    });

    test('uses prefix for tab labels', () => {
      var tabsView = new TabsView({
        fallbackTranslationKeyPrefix: 'tabs'
      });

      tabsView.tab('one', function() { return new Backbone.View(); });
      tabsView.tab('two', function() { return new Backbone.View(); });

      var tabs = support.dom.Tabs.render(tabsView);

      expect(tabs.tabLabels()).toEqual(['Tab one', 'Tab two']);
    });
  });

  describe('with translationKeyPrefixes option', () => {
    support.useFakeTranslations({
      'tabs.one': 'Tab one',
      'fallback.two': 'Tab two'
    });

    test('uses first present translation based', () => {
      var tabsView = new TabsView({
        translationKeyPrefixes: ['tabs', 'fallback']
      });

      tabsView.tab('one', function() { return new Backbone.View(); });
      tabsView.tab('two', function() { return new Backbone.View(); });

      var tabs = support.dom.Tabs.render(tabsView);

      expect(tabs.tabLabels()).toEqual(['Tab one', 'Tab two']);
    });
  });

  describe('with translationKeyPrefixes and fallbackTranslationKeyPrefix options', () => {
    support.useFakeTranslations({
      'tabs.one': 'Tab one',
      'fallback.two': 'Tab two'
    });

    test('uses first present translation based', () => {
      var tabsView = new TabsView({
        translationKeyPrefixes: ['tabs'],
        fallbackTranslationKeyPrefix: 'fallback'
      });

      tabsView.tab('one', function() { return new Backbone.View(); });
      tabsView.tab('two', function() { return new Backbone.View(); });

      var tabs = support.dom.Tabs.render(tabsView);

      expect(tabs.tabLabels()).toEqual(['Tab one', 'Tab two']);
    });
  });
});
