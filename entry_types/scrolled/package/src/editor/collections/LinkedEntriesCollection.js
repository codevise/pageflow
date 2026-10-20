import Backbone from 'backbone';

export const LinkedEntriesCollection = Backbone.Collection.extend({
  addLinkableEntry(linkableEntry) {
    this.add(linkableEntry.pick('id', 'title', 'url', 'previewUrl', 'publicationState'),
             {merge: true});
  }
});
