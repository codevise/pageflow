import Marionette from 'backbone.marionette';

import {selectableView} from './mixins/selectableView';

import template from '../templates/themeItem.jst';

export const ThemeItemView = Marionette.ItemView.extend({
  tagName: 'li',
  template,
  className: 'theme_item',

  mixins: [selectableView],

  selectionAttribute: 'theme',

  ui: {
    themeName: '.theme_name',
    useButton: '.use_theme',
    inUseRegion: '.theme_in_use'
  },

  events: {
    'click .use_theme': function() {
      this.options.onUse(this.model);
    },
    'mouseenter': 'select',
    'click': 'select'
  },

  onRender: function() {
    this.$el.data('themeName', this.model.get('name'));
    this.ui.themeName.text(this.model.title());

    if (this.inUse()) {
      this.ui.inUseRegion.text('✓');
    }

    this.ui.useButton.toggle(
      !this.inUse()
    );
  },

  inUse: function() {
    return this.model.get('name') === this.options.themeInUse;
  }
});
