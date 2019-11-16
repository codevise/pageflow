describe('TabsView', function() {
  describe('with i18n option', function() {
    support.useFakeTranslations({
      'tabs.one': 'Tab one',
      'tabs.two': 'Tab two'
    });

    it('uses prefix for tab labels', function() {
      var tabsView = new pageflow.TabsView({
        i18n: 'tabs'
      });

      tabsView.tab('one', function() { return new Backbone.View(); });
      tabsView.tab('two', function() { return new Backbone.View(); });

      var tabs = support.dom.Tabs.render(tabsView);

      expect(tabs.tabLabels()).to.eql(['Tab one', 'Tab two']);
    });
  });

  describe('with fallbackTranslationKeyPrefix option', function() {
    support.useFakeTranslations({
      'tabs.one': 'Tab one',
      'tabs.two': 'Tab two'
    });

    it('uses prefix for tab labels', function() {
      var tabsView = new pageflow.TabsView({
        fallbackTranslationKeyPrefix: 'tabs'
      });

      tabsView.tab('one', function() { return new Backbone.View(); });
      tabsView.tab('two', function() { return new Backbone.View(); });

      var tabs = support.dom.Tabs.render(tabsView);

      expect(tabs.tabLabels()).to.eql(['Tab one', 'Tab two']);
    });
  });

  describe('with translationKeyPrefixes option', function() {
    support.useFakeTranslations({
      'tabs.one': 'Tab one',
      'fallback.two': 'Tab two'
    });

    it('uses first present translation based', function() {
      var tabsView = new pageflow.TabsView({
        translationKeyPrefixes: ['tabs', 'fallback']
      });

      tabsView.tab('one', function() { return new Backbone.View(); });
      tabsView.tab('two', function() { return new Backbone.View(); });

      var tabs = support.dom.Tabs.render(tabsView);

      expect(tabs.tabLabels()).to.eql(['Tab one', 'Tab two']);
    });
  });

  describe('with translationKeyPrefixes and fallbackTranslationKeyPrefix options', function() {
    support.useFakeTranslations({
      'tabs.one': 'Tab one',
      'fallback.two': 'Tab two'
    });

    it('uses first present translation based', function() {
      var tabsView = new pageflow.TabsView({
        translationKeyPrefixes: ['tabs'],
        fallbackTranslationKeyPrefix: 'fallback'
      });

      tabsView.tab('one', function() { return new Backbone.View(); });
      tabsView.tab('two', function() { return new Backbone.View(); });

      var tabs = support.dom.Tabs.render(tabsView);

      expect(tabs.tabLabels()).to.eql(['Tab one', 'Tab two']);
    });
  });
});
