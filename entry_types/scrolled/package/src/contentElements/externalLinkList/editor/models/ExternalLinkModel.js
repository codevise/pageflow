import Backbone from 'backbone';
import {transientReferences} from 'pageflow/editor';

export const ExternalLinkModel = Backbone.Model.extend({
  modelName: 'ExternalLink',
  i18nKey: 'external_link',
  mixins: [transientReferences],

  thumbnailUrl: function () {
    const image = this.collection.entry.imageFiles.getByPermaId(this.get('thumbnail'));
    return image ? image.get('thumbnail_url') : '';
  },

  title: function() {
    return this.get('title');
  },

  getFilePosition: function(attribute, coord) {
    const cropPosition = this.get('thumbnailCropPosition');
    return cropPosition ? cropPosition[coord] : 50;
  },

  setFilePosition: function(attribute, coord, value) {
    this.set('thumbnailCropPosition', {
      ...this.get('thumbnailCropPosition'),
      [coord]: value
    });
  },

  setFilePositions: function(attribute, x, y) {
    this.set('thumbnailCropPosition', {x, y});
  },
});
