import Backbone from 'backbone';
import {transientReferences} from 'pageflow/editor';

export const ExternalLinkModel = Backbone.Model.extend({
  modelName: 'ExternalLink',
  i18nKey: 'external_link',
  mixins: [transientReferences],

  thumbnailUrl: function () {
    return this.thumbnail()?.get('thumbnail_url') || '';
  },

  thumbnail: function () {
    return this.collection.entry.getFileCollection('image_files').getByPermaId(this.get('thumbnail'));
  },

  title: function() {
    const configuration = this.collection.contentElement.configuration;

    if (configuration.get('textPosition') === 'none' ) {
      return this.thumbnail()?.configuration.get('alt');
    }
    else {
      const itemTexts = configuration.get('itemTexts');

      return itemTexts?.[this.id]?.title ?
             itemTexts?.[this.id]?.title[0]?.children?.[0]?.text :
             this.get('title');
    }
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

  highlight() {
    this.collection.contentElement.postCommand({
      type: 'HIGHLIGHT_ITEM',
      index: this.collection.indexOf(this)
    });
  },

  resetHighlight() {
    this.collection.contentElement.postCommand({
      type: 'RESET_ITEM_HIGHLIGHT'
    });
  }
});
