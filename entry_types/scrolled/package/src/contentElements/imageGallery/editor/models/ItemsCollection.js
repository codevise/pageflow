import Backbone from 'backbone';
import {editor} from 'pageflow/editor';

import {Item} from './Item';

export const ItemsCollection = Backbone.Collection.extend({
  model: Item,
  comparator: 'position',

  initialize(models, options) {
    this.entry = options.entry;
    this.contentElement = options.contentElement;
    this.listenTo(this, 'add remove sort', this.updateConfiguration);
  },

  updateConfiguration() {
    this.contentElement.configuration.set('items', this.toJSON());
  },

  selectImage() {
    editor.selectFile('image_files', 'newImageGalleryItem', {
      id: this.contentElement.id
    });
  },

  addWithId(imageFile) {
    this.add({
      id: this.length ? Math.max(...this.pluck('id')) + 1 : 1,
      image: imageFile.get('perma_id')
    });
  },

  saveOrder() {}
});

ItemsCollection.forContentElement = function(contentElement, entry) {
  return new ItemsCollection(contentElement.configuration.get('items') || [], {
    entry: entry,
    contentElement: contentElement
  });
};

const FileSelectionHandler = function(options) {
  const contentElement = options.entry.contentElements.get(options.id);

  this.call = function(file) {
    ItemsCollection.forContentElement(contentElement).addWithId(file);
  };

  this.getReferer = function() {
    return '/scrolled/content_elements/' + contentElement.id;
  };
};

editor.registerFileSelectionHandler('newImageGalleryItem', FileSelectionHandler);
