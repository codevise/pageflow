describe('ConfigurationEditorView', function() {
  describe('without tab translation key option', function() {
    support.useFakeTranslations({
      'pageflow.ui.configuration_editor.tabs.one': 'Tab one',
      'pageflow.ui.configuration_editor.tabs.two': 'Tab two'
    });

    it('uses default translation key prefix', function() {
      var configurationEditorView = new pageflow.ConfigurationEditorView();

      configurationEditorView.tab('one', function() {});
      configurationEditorView.tab('two', function() {});

      configurationEditorView.render();
      var tabs = support.dom.Tabs.find(configurationEditorView);

      expect(tabs.tabLabels()).to.eql(['Tab one', 'Tab two']);
    });
  });

  describe('with tabTranslationKeyPrefix option', function() {
    support.useFakeTranslations({
      'custom.one': 'Tab custom',
      'pageflow.ui.configuration_editor.tabs.one': 'Tab one'
    });

    it('uses custom translation key prefix', function() {
      var configurationEditorView = new pageflow.ConfigurationEditorView({
        tabTranslationKeyPrefix: 'custom'
      });

      configurationEditorView.tab('one', function() {});

      configurationEditorView.render();
      var tabs = support.dom.Tabs.find(configurationEditorView);

      expect(tabs.tabLabels()).to.eql(['Tab custom']);
    });
  });

  describe('with tabTranslationKeyPrefixes option', function() {
    support.useFakeTranslations({
      'custom.one': 'Tab custom',
      'fallback.two': 'Tab fallback',
      'pageflow.ui.configuration_editor.tabs.two': 'Tab two'
    });

    it('uses first present translation', function() {
      var configurationEditorView = new pageflow.ConfigurationEditorView({
        tabTranslationKeyPrefixes: ['custom', 'fallback']
      });

      configurationEditorView.tab('one', function() {});
      configurationEditorView.tab('two', function() {});

      configurationEditorView.render();
      var tabs = support.dom.Tabs.find(configurationEditorView);

      expect(tabs.tabLabels()).to.eql(['Tab custom', 'Tab fallback']);
    });
  });
});
