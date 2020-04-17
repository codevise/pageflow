import _ from 'underscore';
import {StorylinePickerView} from './StorylinePickerView';

export const EntryOutlineView = function(options) {
  return new StorylinePickerView(_.extend({
    navigatable: true,
    editable: true,
    displayInNavigationHint: true,
    rememberLastSelection: true,
  }, options));
};
