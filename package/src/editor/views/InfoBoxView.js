import Marionette from 'backbone.marionette';

import {attributeBinding} from 'pageflow/ui';

export const InfoBoxView = Marionette.ItemView.extend({
  className: 'info_box',

  mixins: [attributeBinding],

  template: (data) => data.icon ?
    `<div class="with_icon"><img src="${data.icon}" /><span>${data.text}</span></div>` :
    data.text,

  serializeData() {
    return {
      text: this.options.text,
      icon: this.options.icon
    };
  },

  initialize() {
    this.setupBooleanAttributeBinding('visible', this.updateVisible);
  },

  onRender() {
    this.$el.addClass(this.options.level);
    this.updateVisible();
  },

  updateVisible() {
    this.$el.toggleClass('hidden_via_binding',
                         this.getBooleanAttributBoundOption('visible') === false);
  }
});
