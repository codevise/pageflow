import I18n from 'i18n-js';
import Marionette from 'backbone.marionette';

import {CheckBoxInputView, ConfigurationEditorView, TextInputView} from '$pageflow/ui';

import {failureIndicatingView} from './mixins/failureIndicatingView';

import template from '../templates/editChapter.jst';

import {editor} from '../base';

export const EditChapterView = Marionette.Layout.extend({
  template,
  className: 'edit_chapter',

  mixins: [failureIndicatingView],

  regions: {
    formContainer: '.form_container'
  },

  events: {
    'click a.back': 'goBack',
    'click a.destroy': 'destroy'
  },

  onRender: function() {
    var configurationEditor = new ConfigurationEditorView({
      model: this.model.configuration
    });

    this.configure(configurationEditor);
    this.formContainer.show(configurationEditor);
  },

  configure: function(configurationEditor) {
    var view = this;

    configurationEditor.tab('general', function() {
      this.input('title', TextInputView, {
        model: view.model
      });

      if (pageflow.features.isEnabled('chapter_hierachy')) {
        this.input('display_parent_page_button', CheckBoxInputView);
      }
    });
  },

  destroy: function() {
    if (confirm(I18n.t('pageflow.editor.views.edit_chapter_view.confirm_destroy'))) {
      this.model.destroy();
      this.goBack();
    }
  },

  goBack: function() {
    editor.navigate('/', {trigger: true});
  }
});
