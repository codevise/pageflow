describe('EditPageView', function() {
  var f = support.factories;

  it('renders configurationEditorView of page type', function() {
    var api = f.editorApi(function(editor) {
      editor.pageTypes.register('rainbow', {
        configurationEditorView: pageflow.ConfigurationEditorView.extend({
          configure: function() {
            this.tab('general', function() {
              this.input('title', pageflow.TextInputView);
            });
          }
        })
      });
    });
    var page = new pageflow.Page({template: 'rainbow'});
    var view = new pageflow.EditPageView({
      model: page,
      api: api
    });

    view.render();
    var configurationEditor = support.dom.ConfigurationEditor.find(view);

    expect(configurationEditor.tabNames()).to.contain('general');
    expect(configurationEditor.inputPropertyNames()).to.contain('title');
  });

  it('passes page configuration as model', function() {
    var passedModel;
    var api = f.editorApi(function(editor) {
      editor.pageTypes.register('rainbow', {
        configurationEditorView: pageflow.ConfigurationEditorView.extend({
          configure: function() {
            passedModel = this.model;
            this.tab('general', function() {});
          }
        })
      });
    });
    var page = new pageflow.Page({template: 'rainbow'});
    var view = new pageflow.EditPageView({
      model: page,
      api: api
    });

    view.render();

    expect(passedModel).to.eq(page.configuration);
  });

  describe('tab label translations', function() {
    support.useFakeTranslations({
      'pageflow.rainbow.page_configuration_tabs.specific': 'Specific',
      'pageflow.common_page_configuration_tabs.common': 'Common',
      'pageflow.ui.configuration_editor.tabs.fallback': 'Fallback'
    });

    it('uses page type specific translations and fallbacks for tab labels', function() {
      var api = f.editorApi(function(editor) {
        editor.pageTypes.register('rainbow', {
          configurationEditorView: pageflow.ConfigurationEditorView.extend({
            configure: function() {
              this.tab('specific', function() {});
              this.tab('common', function() {});
              this.tab('fallback', function() {});
            }
          })
        });
      });
      var page = new pageflow.Page({template: 'rainbow'});
      var view = new pageflow.EditPageView({
        model: page,
        api: api
      });

      view.render();
      var configurationEditor = support.dom.ConfigurationEditor.find(view);

      expect(configurationEditor.tabLabels()).to.eql(['Specific', 'Common', 'Fallback']);
    });
  });

  it('renders common page configuration tabs with prefixed property names', function() {
    var api = f.editorApi(function(editor) {
      editor.pageTypes.register('rainbow', {
        configurationEditorView: pageflow.ConfigurationEditorView.extend({
          configure: function() {
            this.tab('general', function() {
              this.input('title', pageflow.TextInputView);
            });
          }
        })
      });

      editor.commonPageConfigurationTabs.register('extras', function() {
        this.input('text', pageflow.TextInputView);
      });
    });
    var page = new pageflow.Page({template: 'rainbow'});
    var view = new pageflow.EditPageView({
      model: page,
      api: api,
      tab: 'extras'
    });

    view.render();
    var configurationEditor = support.dom.ConfigurationEditor.find(view);

    expect(configurationEditor.tabNames()).to.eql(['general', 'extras']);
    expect(configurationEditor.inputPropertyNames()).to.eql(['extras_text']);
  });
});
