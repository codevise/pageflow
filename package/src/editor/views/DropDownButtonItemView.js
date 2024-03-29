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

      if (this.model.get('kind') === 'checkBox' ||
          this.model.get('kind') === 'radio') {
        event.stopPropagation();
      }
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
    this.$el.toggleClass('is_hidden', !!this.model.get('hidden'));
    this.$el.toggleClass('has_check_box', this.model.get('kind') === 'checkBox');
    this.$el.toggleClass('has_radio', this.model.get('kind') === 'radio');
    this.$el.toggleClass('is_checked', !!this.model.get('checked'));
    this.$el.toggleClass('separated', !!this.model.get('separated'));

    this.$el.data('name', this.model.get('name'));
  }
});
