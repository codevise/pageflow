pageflow.EditStorylineView = Backbone.Marionette.Layout.extend({
  template: 'templates/edit_storyline',
  className: 'edit_storyline',

  mixins: [pageflow.failureIndicatingView, pageflow.tooltipContainer],

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

    this.configure(configurationEditor, this.model.transitiveChildPages());
    this.formContainer.show(configurationEditor);

    this.updateDestroyButton();
  },

  updateDestroyButton: function() {
    var disabled = (this.model.chapters.length > 0);

    this.ui.destroyButton.toggleClass('disabled', disabled);

    if (disabled) {
      this.ui.destroyButton.attr('data-tooltip', 'pageflow.editor.views.edit_storyline_view.cannot_destroy');
    }
    else {
      this.ui.destroyButton.removeAttr('data-tooltip');
    }
  },

  configure: function(configurationEditor, storylineChildPages) {
    configurationEditor.tab('general', function() {
      this.input('title', pageflow.TextInputView);
      this.input('main', pageflow.CheckBoxInputView, {
        disabled: true,
        visibleBinding: 'main'
      });
      this.input('page_transition', pageflow.SelectInputView, {
        translationKeyPrefix: 'pageflow.page_transitions',
        includeBlank: true,
        blankTranslationKey: 'pageflow.editor.views.edit_storyline_view.default_parent_page_transition',
        values: pageflow.pageTransitions.names()
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
        },
        isAllowed: function(page) {
          return !storylineChildPages.contain(page);
        }
      });
      this.input('scroll_successor_id', pageflow.PageLinkInputView);

      if (pageflow.features.isEnabled('chapter_hierachy')) {
        this.input('navigation_bar_mode', pageflow.SelectInputView, {
          values: pageflow.ChapterFilter.strategies
        });
      }
    });
  },

  destroy: function() {
    if (this.model.chapters.length) {
      return;
    }

    if (confirm(I18n.t('pageflow.editor.views.edit_storyline_view.confirm_destroy'))) {
      this.model.destroy();
      this.goBack();
    }
  },

  goBack: function() {
    editor.navigate('/?storyline=' + this.model.id, {trigger: true});
  }
});