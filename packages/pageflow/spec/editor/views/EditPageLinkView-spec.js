describe('EditPageLinkView', function() {
  var f = support.factories;

  it('renders pageLinkConfigurationEditorView of page type', function() {
    var api = f.editorApi(function(editor) {
      editor.pageTypes.register('rainbow', {
        pageLinkConfigurationEditorView: pageflow.ConfigurationEditorView.extend({
          configure: function() {
            this.tab('general', function() {
              this.input('label', pageflow.TextInputView);
            });
          }
        })
      });
    });
    var page = new pageflow.Page({template: 'rainbow'});
    var pageLink = new pageflow.PageLink();
    var view = new pageflow.EditPageLinkView({
      model: pageLink,
      page: page,
      api: api
    });

    view.render();
    var configurationEditor = support.dom.ConfigurationEditor.find(view);

    expect(configurationEditor.tabNames()).to.contain('general');
    expect(configurationEditor.inputPropertyNames()).to.contain('label');
  });

  it('passes page link configuration as model and page option', function() {
    var passedModel, passedPage;
    var api = f.editorApi(function(editor) {
      editor.pageTypes.register('rainbow', {
        pageLinkConfigurationEditorView: pageflow.ConfigurationEditorView.extend({
          configure: function() {
            passedModel = this.model;
            passedPage = this.options.page;

            this.tab('general', function() {});
          }
        })
      });
    });
    var page = new pageflow.Page({template: 'rainbow'});
    var pageLink = new pageflow.PageLink();
    var view = new pageflow.EditPageLinkView({
      model: pageLink,
      page: page,
      api: api
    });

    view.render();

    expect(passedModel).to.eq(pageLink);
    expect(passedPage).to.eq(page);
  });

  describe('tab label translations', function() {
    support.useFakeTranslations({
      'pageflow.rainbow.page_link_configuration_tabs.specific': 'Specific',
      'pageflow.common_page_link_configuration_tabs.common': 'Common',
      'pageflow.ui.configuration_editor.tabs.fallback': 'Fallback'
    });

    it('uses page type specific translations and fallbacks for tab labels', function() {
      var api = f.editorApi(function(editor) {
        editor.pageTypes.register('rainbow', {
          pageLinkConfigurationEditorView: pageflow.ConfigurationEditorView.extend({
            configure: function() {
              this.tab('specific', function() {});
              this.tab('common', function() {});
              this.tab('fallback', function() {});
            }
          })
        });
      });
      var page = new pageflow.Page({template: 'rainbow'});
      var pageLink = new pageflow.PageLink();
      var view = new pageflow.EditPageLinkView({
        model: pageLink,
        page: page,
        api: api
      });

      view.render();
      var configurationEditor = support.dom.ConfigurationEditor.find(view);

      expect(configurationEditor.tabLabels()).to.eql(['Specific', 'Common', 'Fallback']);
    });
  });
});
