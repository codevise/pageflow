import Backbone from 'backbone';
import {transientReferences} from 'pageflow/editor';

export const Item = Backbone.Model.extend({
  mixins: [transientReferences],

  thumbnailFile() {
    return this.imageFile()?.thumbnailFile();
  },

  title() {
    return this.imageFile()?.title();
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
  },

  imageFile() {
    return this.collection.entry.imageFiles.getByPermaId(this.get('image'));
  }
});
