/** @api private */
pageflow.DropDownButtonItemView = Backbone.Marionette.ItemView.extend({
  template: 'pageflow/editor/templates/drop_down_button_item',
  tagName: 'li',
  className: 'drop_down_button_item',

  ui: {
    link: '> a'
  },

  events: {
    'click > a': function() {
      if (!this.model.get('disabled')) {
        this.model.selected();
      }

      return false;
    }
  },

  modelEvents: {
    change: 'update'
  },

  onRender: function() {
    this.update();
  },

  update: function() {
    this.ui.link.text(this.model.get('label'));
    this.$el.toggleClass('is_disabled', !!this.model.get('disabled'));
  }
});