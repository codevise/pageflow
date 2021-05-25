import {ConfigurationEditorView} from 'pageflow/ui';

import Marionette from 'backbone.marionette';
import Backbone from 'backbone';

import * as support from '$support';
import {Tabs} from '$support/dominos/ui'

describe('ConfigurationEditorView', () => {
  it('passes model to inputs', () => {
    let inputView;
    const InputView = Marionette.View.extend({
      initialize() {
        inputView = this;
      }
    });
    const model = new Backbone.Model();
    const configurationEditorView = new ConfigurationEditorView({model});

    configurationEditorView.tab('one', function() {
      this.input('name', InputView);
    });

    configurationEditorView.render();

    expect(inputView.model).toBe(model);
  });

  it('allows overriding model per tab', () => {
    let inputView;
    const InputView = Marionette.View.extend({
      initialize() {
        inputView = this;
      }
    });
    const model = new Backbone.Model();
    const tabModel = new Backbone.Model();
    const configurationEditorView = new ConfigurationEditorView({model});

    configurationEditorView.tab('one', {model: tabModel}, function() {
      this.input('name', InputView);
    });

    configurationEditorView.render();

    expect(inputView.model).toBe(tabModel);
  });

  describe('without tab translation key option', () => {
    support.useFakeTranslations({
      'pageflow.ui.configuration_editor.tabs.one': 'Tab one',
      'pageflow.ui.configuration_editor.tabs.two': 'Tab two'
    });

    it('uses default translation key prefix', () => {
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

    it('uses custom translation key prefix', () => {
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

    it('uses first present translation', () => {
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
