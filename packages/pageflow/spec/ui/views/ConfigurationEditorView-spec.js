import {ConfigurationEditorView} from '$pageflow/ui';

import * as support from '$support';
import {Tabs} from '$support/dominos/ui'

describe('ConfigurationEditorView', () => {
  describe('without tab translation key option', () => {
    support.useFakeTranslations({
      'pageflow.ui.configuration_editor.tabs.one': 'Tab one',
      'pageflow.ui.configuration_editor.tabs.two': 'Tab two'
    });

    test('uses default translation key prefix', () => {
      var configurationEditorView = new ConfigurationEditorView();

      configurationEditorView.tab('one', function() {});
      configurationEditorView.tab('two', function() {});

      configurationEditorView.render();
      var tabs = Tabs.find(configurationEditorView);

      expect(tabs.tabLabels()).toEqual(['Tab one', 'Tab two']);
    });
  });

  describe('with tabTranslationKeyPrefix option', () => {
    support.useFakeTranslations({
      'custom.one': 'Tab custom',
      'pageflow.ui.configuration_editor.tabs.one': 'Tab one'
    });

    test('uses custom translation key prefix', () => {
      var configurationEditorView = new ConfigurationEditorView({
        tabTranslationKeyPrefix: 'custom'
      });

      configurationEditorView.tab('one', function() {});

      configurationEditorView.render();
      var tabs = Tabs.find(configurationEditorView);

      expect(tabs.tabLabels()).toEqual(['Tab custom']);
    });
  });

  describe('with tabTranslationKeyPrefixes option', () => {
    support.useFakeTranslations({
      'custom.one': 'Tab custom',
      'fallback.two': 'Tab fallback',
      'pageflow.ui.configuration_editor.tabs.two': 'Tab two'
    });

    test('uses first present translation', () => {
      var configurationEditorView = new ConfigurationEditorView({
        tabTranslationKeyPrefixes: ['custom', 'fallback']
      });

      configurationEditorView.tab('one', function() {});
      configurationEditorView.tab('two', function() {});

      configurationEditorView.render();
      var tabs = Tabs.find(configurationEditorView);

      expect(tabs.tabLabels()).toEqual(['Tab custom', 'Tab fallback']);
    });
  });
});
