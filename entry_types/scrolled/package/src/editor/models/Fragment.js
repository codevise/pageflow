import Backbone from 'backbone';

const appearanceKeys = ['layout', 'appearance', 'invert'];

export const Fragment = Backbone.Model.extend({
  idAttribute: 'key',

  firstSectionPermaId() {
    return this.get('sections')[0]?.permaId;
  },

  seed(entrySeed, {section} = {}) {
    const collections = this.seedCollections(entrySeed);

    return {
      ...entrySeed,
      collections: section ?
                   withAppearanceOf(section, {
                     collections,
                     sectionPermaId: this.firstSectionPermaId()
                   }) :
                   collections
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
      kind: chapter.configuration.fragment?.kind || 'sections',
      title: chapter.configuration.title,
      sections,
      collections: fragmentCollections(collections, chapter, sections)
    };
  });
}

function fragmentCollections(collections, chapter, sections) {
  const sectionIds = sections.map(section => section.id);
  const contentElements = collections.contentElements.filter(
    contentElement => sectionIds.includes(contentElement.sectionId)
  );
  const linkedEntryIds = contentElements.flatMap(
    contentElement => entryIdsOfLinks(contentElement.configuration)
  );

  return {
    ...collections,
    chapters: [chapter],
    sections,
    contentElements,
    linkedEntries: (collections.linkedEntries || []).filter(
      linkedEntry => linkedEntryIds.includes(linkedEntry.id)
    ),
    widgets: []
  };
}

function entryIdsOfLinks(value) {
  if (Array.isArray(value)) {
    return value.flatMap(entryIdsOfLinks);
  }
  else if (value && typeof value === 'object') {
    return [
      ...(value.href?.entry ? [value.href.entry] : []),
      ...Object.values(value).flatMap(entryIdsOfLinks)
    ];
  }

  return [];
}

function withAppearanceOf(section, {collections, sectionPermaId}) {
  const configuration = pick(section.configuration.attributes, appearanceKeys);

  return {
    ...collections,
    sections: collections.sections.map(item =>
      item.permaId === sectionPermaId ?
      {...item, configuration} :
      item
    )
  };
}

function pick(attributes, keys) {
  return keys.reduce((result, key) => (
    key in attributes ? {...result, [key]: attributes[key]} : result
  ), {});
}
