import Marionette from 'backbone.marionette';
import _ from 'underscore';

import {FileThumbnailView} from './FileThumbnailView';
import {loadable} from './mixins/loadable';
import {selectableView} from './mixins/selectableView';

import template from '../templates/explorerFileItem.jst';

export const ExplorerFileItemView = Marionette.ItemView.extend({
  tagName: 'li',
  template,

  mixins: [loadable, selectableView],

  selectionAttribute: 'file',

  ui: {
    fileName: '.file_name',

    thumbnail: '.file_thumbnail'
  },

  events: {
    'click': function() {
      if (!this.$el.hasClass('disabled')) {
        this.select();
      }
    }
  },

  modelEvents: {
    'change': 'update'
  },

  onRender: function() {
    this.update();

    this.subview(new FileThumbnailView({
      el: this.ui.thumbnail,
      model: this.model
    }));
  },

  update: function() {
    if (this.isDisabled()) {
      this.$el.addClass('disabled');
    }

    this.$el.attr('data-id', this.model.id);
    this.ui.fileName.text(this.model.get('file_name') || '(Unbekannt)');
  },

  isDisabled: function() {
    return (this.options.disabledIds && _.contains(this.options.disabledIds, this.model.get('id')));
  }
});
