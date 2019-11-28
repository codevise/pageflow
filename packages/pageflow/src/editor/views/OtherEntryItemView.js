import Marionette from 'backbone.marionette';

import {selectableView} from './mixins/selectableView';

import template from '../templates/otherEntryItem.jst';

export const OtherEntryItemView = Marionette.ItemView.extend({
  template,
  className: 'other_entry_item',
  tagName: 'li',

  mixins: [selectableView],

  ui: {
    title: '.title'
  },

  events: {
    'click': 'select'
  },

  onRender: function() {
    this.ui.title.text(this.model.titleOrSlug());
  }
});
