import Backbone from 'backbone';

export const LinkedEntriesCollection = Backbone.Collection.extend({
  addLinkableEntry(linkableEntry, {chapter} = {}) {
    const linkedChapter = findLinkedChapter(linkableEntry, chapter);

    this.mergeLinkedEntries([{
      ...linkableEntry.pick('id', 'title', 'url', 'previewUrl', 'publicationState'),
      ...(linkedChapter && {chapters: [linkedChapter]})
    }]);
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

function findLinkedChapter(linkableEntry, permaId) {
  const chapter = permaId &&
                  (linkableEntry.get('chapters') || []).find(item => item.permaId === permaId);

  return chapter && {
    permaId,
    title: chapter.title,
    slug: chapter.slug,
    previewSlug: chapter.slug
  };
}
