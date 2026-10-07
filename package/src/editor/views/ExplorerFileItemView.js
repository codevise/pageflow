import I18n from 'i18n-js';
import Marionette from 'backbone.marionette';

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
    thumbnail: '.file_thumbnail',
    markButton: '.explorer_file_item-mark'
  },

  events: {
    'click .explorer_file_item-mark': function() {
      this.options.markedFiles.toggle(this.model);

      if (this.options.markedFiles.includes(this.model)) {
        this.select();
      }

      return false;
    },

    'click': function() {
      if (!this.isDisabled()) {
        this.select();
      }
    }
  },

  modelEvents: {
    'change': 'update'
  },

  initialize: function() {
    if (this.options.markedFiles) {
      this.listenTo(this.options.markedFiles, 'add remove reset', this.updateMarked);
    }
  },

  onRender: function() {
    this.update();
    this.updateMarked();

    if (this.isDisabled() || !this.options.markedFiles) {
      this.ui.markButton.remove();
    }

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
    this.ui.fileName.text(this.model.title());
  },

  isMarking: function() {
    return !!this.options.markedFiles?.length;
  },

  updateMarked: function() {
    var marked = !!this.options.markedFiles?.includes(this.model);

    this.$el.toggleClass('marking', this.isMarking());
    this.$el.toggleClass('marked', marked);
    var label = I18n.t(this.isMarking() ?
                       'pageflow.editor.views.explorer_file_item_view.mark' :
                       'pageflow.editor.views.explorer_file_item_view.start_marking');

    this.ui.markButton.attr({
      'aria-pressed': marked ? 'true' : 'false',
      'aria-label': label,
      title: label
    });
  },

  isDisabled: function() {
    return !!this.options.currentEntry
      ?.getFileCollection(this.model.fileType())
      .get(this.model.id);
  }
});
