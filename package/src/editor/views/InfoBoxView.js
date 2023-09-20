import Marionette from 'backbone.marionette';

import {attributeBinding} from 'pageflow/ui';

export const InfoBoxView = Marionette.View.extend({
  className: 'info_box',

  mixins: [attributeBinding],

  initialize() {
    this.setupBooleanAttributeBinding('visible', this.updateVisible);
  },

  updateVisible: function() {
    this.$el.toggleClass('hidden_via_binding',
                         this.getBooleanAttributBoundOption('visible') === false);
  },

  render: function() {
    this.$el.addClass(this.options.level)
    this.$el.html(this.options.text);
    return this;
  }
});
