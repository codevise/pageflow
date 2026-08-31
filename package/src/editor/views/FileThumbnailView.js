import Marionette from 'backbone.marionette';

import {CollectionView} from 'pageflow/ui';

import template from '../templates/fileThumbnail.jst';
import {FileStageIconView} from './FileStageIconView';

export const FileThumbnailView = Marionette.ItemView.extend({
  className: 'file_thumbnail',
  template,

  modelEvents: {
    'change:state': 'update'
  },

  ui: {
    pictogram: '.pictogram',
    custom: '.file_thumbnail-custom'
  },

  onRender: function() {
    if (this.model) {
      this.appendSubview(new CollectionView({
        tagName: 'span',
        className: 'file_thumbnail-stage_icon',
        collection: this.model.currentStages,
        itemViewConstructor: FileStageIconView
      }));
    }

    this.update();
  },

  update: function() {
    if (this.model) {
      this.ui.pictogram.addClass(this.model.thumbnailPictogram);
      this.$el.css('background-image', this._imageUrl() ? 'url(' + this._imageUrl() + ')' : '');
      this.$el
        .toggleClass('always_picogram', !!this.model.thumbnailPictogram)
        .toggleClass('ready', this.model.isReady());

      this.renderCustomThumbnail();
    }
    else {
      this.$el.css('background-image', '');
      this.$el.removeClass('ready');
      this.ui.pictogram.addClass('empty');
    }
  },

  // File types can render their own thumbnail instead of the image
  // pointed at by the thumbnail url. Only created once the file is
  // ready, which is why this is retried on state changes.
  renderCustomThumbnail: function() {
    if (this.customThumbnailView) {
      return;
    }

    this.customThumbnailView = this.model.createThumbnailView?.();

    if (this.customThumbnailView) {
      this.appendSubview(this.customThumbnailView, {to: this.ui.custom});
    }
  },

  _imageUrl: function() {
    return this.model.get(this.options.imageUrlPropertyName || 'thumbnail_url');
  }
});
