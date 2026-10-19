import Backbone from 'backbone';

export const LinkedEntriesCollection = Backbone.Collection.extend({
  addLinkableEntry(linkableEntry) {
    this.mergeLinkedEntries([
      linkableEntry.pick('id', 'title', 'url', 'previewUrl', 'publicationState')
    ]);
  },

  mergeLinkedEntries(linkedEntries) {
    linkedEntries.forEach(attributes => {
      const linkedEntry = this.get(attributes.id);

      if (linkedEntry) {
        linkedEntry.set({
          ...attributes,
          chapters: mergeChapters(linkedEntry.get('chapters'), attributes.chapters)
        });
      }
      else {
        this.add(attributes);
      }
    });
  }
});

function mergeChapters(chapters = [], newChapters = []) {
  return [
    ...chapters,
    ...newChapters.filter(chapter =>
      !chapters.some(existingChapter => existingChapter.permaId === chapter.permaId)
    )
  ];
}
