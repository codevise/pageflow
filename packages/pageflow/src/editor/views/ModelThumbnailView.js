import Marionette from 'backbone.marionette';
import _ from 'underscore';

import {FileThumbnailView} from './FileThumbnailView';
import {StaticThumbnailView} from './StaticThumbnailView';

/**
 * Base thumbnail view for models supporting a `thumbnailFile` method.
 *
 * @class
 */
export const ModelThumbnailView = Marionette.View.extend({
  className: 'model_thumbnail',

  modelEvents: {
    'change:configuration': 'update'
  },

  render: function() {
    this.update();
    return this;
  },

  update: function() {
    if (this.model) {
      if (_.isFunction(this.model.thumbnailFile)) {
        var file = this.model && this.model.thumbnailFile();

        if (this.thumbnailView && this.currentFileThumbnail == file) {
          return;
        }

        this.currentFileThumbnail = file;

        this.newThumbnailView = new FileThumbnailView({
          model: file,
          className: 'thumbnail file_thumbnail',
          imageUrlPropertyName: this.options.imageUrlPropertyName
        });
      }
      else {
        this.newThumbnailView = this.newThumbnailView ||
          new StaticThumbnailView({
            model: this.model
          });
      }
    }

    if (this.thumbnailView) {
      this.thumbnailView.close();
    }

    if (this.model) {
      this.thumbnailView = this.subview(this.newThumbnailView);

      this.$el.append(this.thumbnailView.el);
    }
  }
});
