import I18n from 'i18n-js';
import Marionette from 'backbone.marionette';

import {CheckBoxInputView, ConfigurationEditorView, SelectInputView, TextInputView, tooltipContainer} from 'pageflow/ui';

import {PageLinkInputView} from './inputs/PageLinkInputView';
import {editor, failureIndicatingView} from 'pageflow/editor';
import {features} from 'pageflow/frontend';
import {ChapterFilter} from 'pageflow-paged/frontend';

import {state} from '$state';

import template from '../templates/editStoryline.jst';

export const EditStorylineView = Marionette.Layout.extend({
  template,
  className: 'edit_storyline',

  mixins: [failureIndicatingView, tooltipContainer],

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
    var configurationEditor = new ConfigurationEditorView({
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
      this.input('title', TextInputView);
      this.input('main', CheckBoxInputView, {
        disabled: true,
        visibleBinding: 'main'
      });
      this.group('page_transitions', {
        includeBlank: true
      });
      this.input('main', CheckBoxInputView, {
        visibleBinding: 'main',
        visible: function(isMain) {
          return !isMain;
        }
      });
      this.input('parent_page_perma_id', PageLinkInputView, {
        visibleBinding: 'main',
        visible: function(isMain) {
          return !isMain && state.storylines.length > 1;
        },
        isAllowed: function(page) {
          return !storylineChildPages.contain(page);
        }
      });
      this.input('scroll_successor_id', PageLinkInputView);

      if (features.isEnabled('chapter_hierachy')) {
        this.input('navigation_bar_mode', SelectInputView, {
          values: ChapterFilter.strategies
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
