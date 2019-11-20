import {ConfigurationEditorView, TextInputView} from '$pageflow/ui';

import {EditPageView, Page} from '$pageflow/editor';

import * as support from '$support';
import {ConfigurationEditor} from '$support/dominos/ui';

describe('EditPageView', () => {
  var f = support.factories;

  it('renders configurationEditorView of page type', () => {
    var api = f.editorApi(function(editor) {
      editor.pageTypes.register('rainbow', {
        configurationEditorView: ConfigurationEditorView.extend({
          configure: function() {
            this.tab('general', function() {
              this.input('title', TextInputView);
            });
          }
        })
      });
    });
    var page = new Page({template: 'rainbow'});
    var view = new EditPageView({
      model: page,
      api: api
    });

    view.render();
    var configurationEditor = ConfigurationEditor.find(view);

    expect(configurationEditor.tabNames()).toEqual(expect.arrayContaining(['general']));
    expect(configurationEditor.inputPropertyNames()).toEqual(expect.arrayContaining(['title']));
  });

  it('passes page configuration as model', () => {
    var passedModel;
    var api = f.editorApi(function(editor) {
      editor.pageTypes.register('rainbow', {
        configurationEditorView: ConfigurationEditorView.extend({
          configure: function() {
            passedModel = this.model;
            this.tab('general', function() {});
          }
        })
      });
    });
    var page = new Page({template: 'rainbow'});
    var view = new EditPageView({
      model: page,
      api: api
    });

    view.render();

    expect(passedModel).toBe(page.configuration);
  });

  describe('tab label translations', () => {
    support.useFakeTranslations({
      'pageflow.rainbow.page_configuration_tabs.specific': 'Specific',
      'pageflow.common_page_configuration_tabs.common': 'Common',
      'pageflow.ui.configuration_editor.tabs.fallback': 'Fallback'
    });

    it(
      'uses page type specific translations and fallbacks for tab labels',
      () => {
        var api = f.editorApi(function(editor) {
          editor.pageTypes.register('rainbow', {
            configurationEditorView: ConfigurationEditorView.extend({
              configure: function() {
                this.tab('specific', function() {});
                this.tab('common', function() {});
                this.tab('fallback', function() {});
              }
            })
          });
        });
        var page = new Page({template: 'rainbow'});
        var view = new EditPageView({
          model: page,
          api: api
        });

        view.render();
        var configurationEditor = ConfigurationEditor.find(view);

        expect(configurationEditor.tabLabels()).toEqual(['Specific', 'Common', 'Fallback']);
      }
    );
  });

  it(
    'renders common page configuration tabs with prefixed property names',
    () => {
      var api = f.editorApi(function(editor) {
        editor.pageTypes.register('rainbow', {
          configurationEditorView: ConfigurationEditorView.extend({
            configure: function() {
              this.tab('general', function() {
                this.input('title', TextInputView);
              });
            }
          })
        });

        editor.commonPageConfigurationTabs.register('extras', function() {
          this.input('text', TextInputView);
        });
      });
      var page = new Page({template: 'rainbow'});
      var view = new EditPageView({
        model: page,
        api: api,
        tab: 'extras'
      });

      view.render();
      var configurationEditor = ConfigurationEditor.find(view);

      expect(configurationEditor.tabNames()).toEqual(['general', 'extras']);
      expect(configurationEditor.inputPropertyNames()).toEqual(['extras_text']);
    }
  );
});
