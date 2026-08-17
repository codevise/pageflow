import Marionette from 'backbone.marionette';

// Renders the image which files point at via
// `getBackgroundPositioningImageUrl`. Used for all file types which do
// not bring a positioning view of their own.
export const BackgroundPositioningImageView = Marionette.ItemView.extend({
  tagName: 'img',
  template: () => '',

  className: function() {
    return 'background_positioning-image-' + this.options.fit;
  },

  onRender: function() {
    this.$el.attr('src', this.model.getBackgroundPositioningImageUrl());
  }
});
