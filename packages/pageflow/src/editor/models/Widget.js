import Backbone from 'backbone';

import {WidgetConfiguration} from './WidgetConfiguration';

export const Widget = Backbone.Model.extend({
  paramRoot: 'widget',
  i18nKey: 'pageflow/widget',

  initialize: function(attributes, options) {
    this.widgetTypes = options.widgetTypes;

    this.configuration = new WidgetConfiguration(
      this.get('configuration') || {}
    );
    this.configuration.parent = this;

    this.listenTo(this.configuration, 'change', function() {
      this.trigger('change:configuration', this);
    });
  },

  widgetType: function() {
    return this.get('type_name') && this.widgetTypes.findByName(this.get('type_name'));
  },

  hasConfiguration: function() {
    return !!(this.widgetType() && this.widgetType().hasConfiguration());
  },

  role: function() {
    return this.id;
  },

  urlRoot: function() {
    return this.collection.url();
  },

  toJSON: function() {
    return {
      role: this.role(),
      type_name: this.get('type_name'),
      configuration: this.configuration.toJSON()
    };
  },
});
