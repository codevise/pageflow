import $ from 'jquery';
import Marionette from 'backbone.marionette';

import {app, editor, dialogView} from 'pageflow/editor';

import {StorylinePickerView} from './StorylinePickerView';

import template from '../templates/pageSelection.jst';

export const PageSelectionView = Marionette.ItemView.extend({
  template,
  className: 'page_selection dialog',

  mixins: [dialogView],

  ui: {
    storylines: '.storyline_picker',
    chapters: '.chapters',
  },

  events: {
    'click ul.pages li': function(event) {
      this.options.onSelect(this.model.pages.get($(event.currentTarget).data('id')));
      this.close();
    }
  },

  onRender: function() {
    var options = this.options;

    this.subview(new StorylinePickerView({
      el: this.ui.storylines,
      entry: this.model,
      pageItemViewOptions: {
        isDisabled: function(page) {
          return options.isAllowed && !options.isAllowed(page);
        }
      }
    }));
  }
});

PageSelectionView.selectPage = function(options) {
  return $.Deferred(function(deferred) {
    var view = new PageSelectionView({
      model: options.entry,
      onSelect: deferred.resolve,
      isAllowed: options && options.isAllowed
    });

    view.on('close', function() {
      deferred.reject();
    });

    app.dialogRegion.show(view.render());
  }).promise();
};

editor.pageSelectionView = PageSelectionView;
