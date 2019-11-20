import Marionette from 'backbone.marionette';

import template from '../templates/editWidget.jst';

import {editor} from '../base';

export const EditWidgetView = Marionette.ItemView.extend({
  template,
  className: 'edit_widget',

  events: {
    'click a.back': function() {
      editor.navigate('/meta_data/widgets', {trigger: true});
    }
  },

  initialize: function() {
    this.model.set('editing', true);
  },

  onClose: function() {
    Marionette.ItemView.prototype.onClose.call(this);
    this.model.set('editing', false);
  },

  onRender: function() {
    var configurationEditor = this.model.widgetType().createConfigurationEditorView({
      model: this.model.configuration,
      tab: this.options.tab
    });

    this.appendSubview(configurationEditor);
  }
});
