import Marionette from 'backbone.marionette';

import {filePreviewDimensions} from './mixins/filePreviewDimensions';

import template from '../templates/imageFilePreview.jst';

export const ImageFilePreviewView = Marionette.ItemView.extend({
  template,
  className: 'file_preview',

  mixins: [filePreviewDimensions],

  ui: {
    image: 'img'
  },

  modelEvents: {
    'change:preview_url': 'update'
  },

  onRender: function() {
    this.update();
  },

  update: function() {
    this.applyDimensions(this.ui.image);
    this.ui.image.attr('src', this.model.get('preview_url'));
  }
});
