import Backbone from 'backbone';

export const Fragment = Backbone.Model.extend({
  idAttribute: 'key',

  firstSectionPermaId() {
    return this.get('sections')[0]?.permaId;
  },

  seed(entrySeed) {
    return {
      ...entrySeed,
      collections: this.seedCollections(entrySeed)
    };
  },

  seedCollections(entrySeed) {
    return {
      ...entrySeed.collections,
      ...this.get('collections')
    };
  }
});

export function fragmentsOfLibrary(library) {
  const collections = library.get('collections');

  return collections.chapters.map(chapter => {
    const sections = collections.sections.filter(
      section => section.chapterId === chapter.id
    );

    return {
      key: `${library.id}-${chapter.permaId}`,
      libraryId: library.id,
      chapterPermaId: chapter.permaId,
      title: chapter.configuration.title,
      sections,
      collections: fragmentCollections(collections, chapter, sections)
    };
  });
}

function fragmentCollections(collections, chapter, sections) {
  const sectionIds = sections.map(section => section.id);

  return {
    ...collections,
    chapters: [chapter],
    sections,
    contentElements: collections.contentElements.filter(
      contentElement => sectionIds.includes(contentElement.sectionId)
    ),
    widgets: []
  };
}
