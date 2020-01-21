import I18n from 'i18n-js';
import Marionette from 'backbone.marionette';

import {SelectInputView} from 'pageflow/ui';

import {editor} from '../base';

import template from '../templates/widgetItem.jst';

export const WidgetItemView = Marionette.Layout.extend({
  template,
  tagName: 'li',
  className: 'widget_item',

  regions: {
    widgetTypeContainer: '.widget_type'
  },

  ui: {
    role: 'h2'
  },

  modelEvents: {
    'change:type_name': 'update'
  },

  events: {
    'click .settings': function() {
      editor.navigate('/widgets/' + this.model.role(), {trigger: true});
      return false;
    },
  },

  onRender: function() {
    var widgetTypes = this.options.widgetTypes.findAllByRole(this.model.role()) || [];
    var isOptional = this.options.widgetTypes.isOptional(this.model.role());

    this.widgetTypeContainer.show(new SelectInputView({
      model: this.model,
      propertyName: 'type_name',
      label: I18n.t('pageflow.widgets.roles.' + this.model.role()),
      collection: widgetTypes,
      valueProperty: 'name',
      translationKeyProperty: 'translationKey',
      includeBlank: isOptional || !this.model.get('type_name')
    }));

    this.$el.toggleClass('is_hidden', widgetTypes.length <= 1 &&
                         !this.model.hasConfiguration() &&
                         !isOptional);

    this.update();
  },

  update: function() {
    this.$el.toggleClass('has_settings', this.model.hasConfiguration());
  }
});