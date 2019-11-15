import $ from 'jquery';
import Marionette from 'backbone.marionette';

import {app} from '../app';

import {StorylinePickerView} from './StorylinePickerView';
import {dialogView} from './mixins/dialogView';

import {state} from '$state';

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
      this.options.onSelect(state.pages.get($(event.currentTarget).data('id')));
      this.close();
    }
  },

  onRender: function() {
    var options = this.options;

    this.subview(new StorylinePickerView({
      el: this.ui.storylines,
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
      model: state.entry,
      onSelect: deferred.resolve,
      isAllowed: options && options.isAllowed
    });

    view.on('close', function() {
      deferred.reject();
    });

    app.dialogRegion.show(view.render());
  }).promise();
};