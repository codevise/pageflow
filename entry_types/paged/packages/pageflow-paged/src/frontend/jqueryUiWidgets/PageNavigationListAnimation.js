import Object from '../Object'
import {state} from '../state';

export const PageNavigationListAnimation = Object.extend({
  initialize: function(entryData) {
    this.entry = entryData;
  },

  update: function(currentPagePermaId) {
    var currentPagePosition =
      this.entry.getPagePosition(currentPagePermaId);
    var currentStorylineId =
      this.entry.getStorylineIdByPagePermaId(currentPagePermaId);
    var currentStorylineLevel =
      this.entry.getStorylineLevel(currentStorylineId);

    this.enabled = this.lastStorylineId && this.lastStorylineId !== currentStorylineId;

    this.movingUp = (this.lastStorylineLevel > currentStorylineLevel);
    this.movingDown = (this.lastStorylineLevel < currentStorylineLevel);
    this.movingForwards = (this.lastStorylineLevel === currentStorylineLevel &&
                          this.lastPagePosition < currentPagePosition);
    this.movingBackwards = (this.lastStorylineLevel === currentStorylineLevel &&
                           this.lastPagePosition > currentPagePosition);

    this.lastPagePosition = currentPagePosition;
    this.lastStorylineId = currentStorylineId;
    this.lastStorylineLevel = currentStorylineLevel;
  },

  start: function(element, visible) {
    if (this.enabled) {
      element.toggleClass('moving_up', this.movingUp);
      element.toggleClass('moving_down', this.movingDown);
      element.toggleClass('moving_forwards', this.movingForwards);
      element.toggleClass('moving_backwards', this.movingBackwards);

      element.toggleClass('animate_out', !visible);
    }
  },

  finish: function(element, visible) {
    if (this.enabled) {
      element.toggleClass('animate_in', !!visible);
    }
  }
});

PageNavigationListAnimation.create = function() {
  return new PageNavigationListAnimation(state.entryData);
};