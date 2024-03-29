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

  imageFile() {
    return this.collection.entry.imageFiles.getByPermaId(this.get('image'));
  }
});
