import Marionette from 'backbone.marionette';

import template from '../templates/dropDownButtonItem.jst';

export const DropDownButtonItemView = Marionette.ItemView.extend({
  template,
  tagName: 'li',
  className: 'drop_down_button_item',

  ui: {
    link: '> a',
    label: '> .label'
  },

  events: {
    'click > a': function(event) {
      if (!this.model.get('disabled')) {
        this.model.selected();
      }

      event.preventDefault();
    }
  },

  modelEvents: {
    change: 'update'
  },

  onRender: function() {
    this.update();

    if (this.model.get('items')) {
      this.appendSubview(new this.options.listView({
        items: this.model.get('items')
      }));
    }
  },

  update: function() {
    this.ui.link.text(this.model.get('label'));
    this.ui.label.text(this.model.get('label'));

    this.$el.toggleClass('is_selectable', !!this.model.selected);
    this.$el.toggleClass('is_disabled', !!this.model.get('disabled'));
    this.$el.toggleClass('is_checked', !!this.model.get('checked'));
    this.$el.toggleClass('divider_above', !!this.model.get('dividerAbove'));

    this.$el.data('name', this.model.get('name'));
  }
});
