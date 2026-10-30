import I18n from 'i18n-js';
import Marionette from 'backbone.marionette';

import {FileThumbnailView} from './FileThumbnailView';
import {MarkButtonView} from './MarkButtonView';
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

    this.subview(new FileThumbnailView({
      el: this.ui.thumbnail,
      model: this.model
    }));

    if (!this.isDisabled() && this.options.markedFiles) {
      this.appendMarkButton();
    }
  },

  appendMarkButton: function() {
    var markButton = new MarkButtonView({
      model: this.model,
      selection: this.options.markedFiles,
      label: I18n.t('pageflow.editor.views.explorer_file_item_view.mark'),
      startMarkingLabel: I18n.t('pageflow.editor.views.explorer_file_item_view.start_marking')
    });

    this.appendSubview(markButton);

    this.listenTo(markButton, 'toggle', function() {
      if (this.options.markedFiles.includes(this.model)) {
        this.select();
      }
    });
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
    this.$el.toggleClass('marking', this.isMarking());
    this.$el.toggleClass('marked', !!this.options.markedFiles?.includes(this.model));
  },

  isDisabled: function() {
    return !!this.options.currentEntry
      ?.getFileCollection(this.model.fileType())
      .get(this.model.id);
  }
});
