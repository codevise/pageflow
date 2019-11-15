import Marionette from 'backbone.marionette';

import template from '../templates/staticThumbnail.jst';

export const StaticThumbnailView = Marionette.ItemView.extend({
  template,
  className: 'static_thumbnail',

  modelEvents: {
    'change:configuration': 'update'
  },

  onRender: function() {
    this.update();
  },

  update: function() {
    this.$el.css('background-image', 'url(' + this._imageUrl() + ')');
  },

  _imageUrl: function() {
    return this.model.thumbnailUrl();
  }
});
