import Backbone from 'backbone';
import {transientReferences} from 'pageflow/editor';

export const Area = Backbone.Model.extend({
  mixins: [transientReferences],

  thumbnailFile() {
    return this.imageFile()?.thumbnailFile();
  },

  title() {
    const tooltipTexts = this.collection.contentElement.configuration.get('tooltipTexts');
    return tooltipTexts?.[this.id]?.title?.[0]?.children?.[0]?.text;
  },

  imageFile() {
    return this.collection.entry.imageFiles.getByPermaId(this.get('activeImage'));
  },

  highlight() {
    this.collection.contentElement.postCommand({
      type: 'HIGHLIGHT_AREA',
      index: this.collection.indexOf(this)
    });
  },

  resetHighlight() {
    this.collection.contentElement.postCommand({
      type: 'RESET_AREA_HIGHLIGHT'
    });
  }
});
