pageflow.EditStorylineView = Backbone.Marionette.Layout.extend({
  template: 'templates/edit_storyline',
  className: 'edit_storyline',

  mixins: [pageflow.failureIndicatingView],

  regions: {
    formContainer: '.form_container'
  },

  ui: {
    destroyButton: 'a.destroy'
  },

  events: {
    'click a.back': 'goBack',
    'click a.destroy': 'destroy'
  },

  onRender: function() {
    var configurationEditor = new pageflow.ConfigurationEditorView({
      model: this.model.configuration,
      attributeTranslationKeyPrefixes: ['pageflow.storyline_attributes']
    });

    this.configure(configurationEditor);
    this.formContainer.show(configurationEditor);

    this.ui.destroyButton.toggleClass('faded', this.model.chapters.length > 0);
  },

  configure: function(configurationEditor) {
    var view = this;

    configurationEditor.tab('general', function() {
      this.input('title', pageflow.TextInputView);
      this.input('main', pageflow.CheckBoxInputView, {
        disabled: true,
        visibleBinding: 'main'
      });
      this.input('main', pageflow.CheckBoxInputView, {
        visibleBinding: 'main',
        visible: function(isMain) {
          return !isMain;
        }
      });
      this.input('parent_page_perma_id', pageflow.PageLinkInputView, {
        visibleBinding: 'main',
        visible: function(isMain) {
          return !isMain && pageflow.storylines.length > 1;
        }
      });

      if (pageflow.features.isEnabled('chapter_hierachy')) {
        this.input('navigation_bar_mode', pageflow.SelectInputView, {
          values: pageflow.ChapterFilter.strategies
        });
      }
    });
  },

  destroy: function() {
    if (this.model.chapters.length) {
      alert(I18n.t('pageflow.editor.views.edit_storyline_view.cannot_destroy'));
      return;
    }

    if (confirm(I18n.t('pageflow.editor.views.edit_storyline_view.confirm_destroy'))) {
      this.model.destroy();
      this.goBack();
    }
  },

  goBack: function() {
    editor.navigate('/', {trigger: true});
  }
});