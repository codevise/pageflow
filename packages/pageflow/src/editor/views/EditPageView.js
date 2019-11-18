import I18n from 'i18n-js';
import Marionette from 'backbone.marionette';
import 'jquery-ui';

import {ExtendedSelectInputView} from '$pageflow/ui';

import {app} from '../app';

import {failureIndicatingView} from './mixins/failureIndicatingView';

import template from '../templates/editPage.jst';

export const EditPageView = Marionette.Layout.extend({
  template,
  className: 'edit_page',

  mixins: [failureIndicatingView],

  regions: {
    pageTypeContainer: '.page_type',
    configurationContainer: '.configuration_container'
  },

  events: {
    'click a.back': 'goBack',
    'click a.destroy': 'destroy'
  },

  modelEvents: {
    'change:template': 'load'
  },

  onRender: function() {
    this.pageTypeContainer.show(new ExtendedSelectInputView({
      model: this.model,
      propertyName: 'template',
      collection: this.options.api.pageTypes.pluck('seed'),
      valueProperty: 'name',
      translationKeyProperty: 'translation_key',
      groupTranslationKeyProperty: 'category_translation_key',
      descriptionTranslationKeyProperty: 'description_translation_key',

      pictogramClass: 'type_pictogram',

      helpLinkClicked: function(value) {
        var pageType = this.options.api.pageTypes.findByName(value);
        app.trigger('toggle-help', pageType.seed.help_entry_translation_key);
      }
    }));

    this.load();
    this.model.trigger('edit', this.model);
  },

  onShow: function() {
    this.configurationEditor.refreshScroller();
  },

  load: function() {
    this.configurationEditor = this.options.api.createPageConfigurationEditorView(this.model, {
      tab: this.options.tab
    });

    this.configurationContainer.show(this.configurationEditor);
  },

  destroy: function() {
    if (confirm(I18n.t('pageflow.editor.views.edit_page_view.confirm_destroy'))) {
      this.model.destroy();
      this.goBack();
    }
  },

  goBack: function() {
    editor.navigate('/', {trigger: true});
  }
});
