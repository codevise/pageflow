import I18n from 'i18n-js';
import Marionette from 'backbone.marionette';

import template from '../templates/fileStageItem.jst';

export const FileStageItemView = Marionette.ItemView.extend({
  tagName: 'li',
  className: 'file_stage_item',
  template,

  ui: {
    description: '.description',
    percent: '.percent',
    errorMessage: '.error_message'
  },

  modelEvents: {
    'change': 'update'
  },

  onRender: function() {
    this.update();
    this.$el.addClass(this.model.get('name'));

    if (this.options.standAlone) {
      this.$el.addClass('stand_alone');
    }
    else {
      this.$el.addClass('indented');
    }
  },

  update: function() {
    this.ui.description.text(this.model.localizedDescription());

    if (typeof this.model.get('progress') === 'number' &&
        this.model.get('active')) {
      this.ui.percent.text(this.model.get('progress') + '%');
    }
    else {
      this.ui.percent.text('');
    }

    this.ui.errorMessage
      .toggle(!!this.model.get('error_message'))
      .text(this._translatedErrorMessage());

    this.$el.toggleClass('active', this.model.get('active'));
    this.$el.toggleClass('finished', this.model.get('finished'));
    this.$el.toggleClass('failed', this.model.get('failed'));
    this.$el.toggleClass('action_required', this.model.get('action_required'));
  },

  _translatedErrorMessage: function() {
    return this.model.get('error_message') &&
      I18n.t(this.model.get('error_message'), {
        defaultValue: this.model.get('error_message')
      });
  }
});