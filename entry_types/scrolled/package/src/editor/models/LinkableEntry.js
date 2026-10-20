import Backbone from 'backbone';

import {
  StorylinesCollection,
  ChaptersCollection,
  SectionsCollection,
  ContentElementsCollection
} from '../collections';

export const LinkableEntry = Backbone.Model.extend({
  chapterLinkSignature(permaId) {
    return findSignature(this.get('chapters'), permaId);
  },

  sectionLinkSignature(permaId) {
    return findSignature(this.get('sections'), permaId);
  },

  fetchOutline({entry}) {
    return Promise.resolve(Backbone.$.getJSON(this.url())).then(response => {
      const {collections, ...attributes} = response;
      this.set(attributes);

      return new LinkableEntryOutline({id: this.id}, {
        collections,
        seed: entry.scrolledSeed
      });
    });
  }
});

const LinkableEntryOutline = Backbone.Model.extend({
  readOnly: true,

  initialize(attributes, {collections, seed}) {
    this.contentElements = new ContentElementsCollection(collections.contentElements);
    this.sections = new SectionsCollection(collections.sections,
                                           {contentElements: this.contentElements});
    this.chapters = new ChaptersCollection(collections.chapters,
                                           {sections: this.sections,
                                            entry: this});
    this.storylines = new StorylinesCollection(collections.storylines,
                                               {chapters: this.chapters,
                                                entry: this});
    this.sections.sort();

    this.scrolledSeed = {
      ...seed,
      collections: {
        ...seed.collections,
        ...collections,
        widgets: []
      }
    };
  },

  isCurrentSectionInExcursion() {
    return false;
  }
});

function findSignature(destinations, permaId) {
  return (destinations || []).find(destination => destination.permaId === permaId)?.signature;
}
