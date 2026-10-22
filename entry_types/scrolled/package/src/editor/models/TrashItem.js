import Backbone from 'backbone';

export const TrashItem = Backbone.Model.extend({
  firstSectionPermaId() {
    return this.get('sections')[0]?.permaId;
  },

  seed(entrySeed) {
    const sections = this.get('sections');

    return {
      ...entrySeed,
      collections: {
        ...entrySeed.collections,
        sections: sections.map(({contentElements, ...section}) => section),
        contentElements: sections.flatMap(section => section.contentElements)
      }
    };
  },

  restore() {
    const restored = this.get('kind') === 'chapter' ?
                     this.restoreIntoStoryline() :
                     this.restoreIntoChapter();

    if (!restored) {
      return Promise.reject(new Error('Nothing to restore into.'));
    }

    return new Promise((resolve, reject) => {
      restored.once('sync', () => {
        this.collection.remove(this);
        resolve(restored);
      });
      restored.once('error', reject);
    });
  },

  restoreIntoStoryline() {
    const storyline = this.collection.entry.storylines.findWhere({
      permaId: this.get('originPermaId')
    });

    return storyline && storyline.restoreChapter(this);
  },

  restoreIntoChapter() {
    const {parent, position} = this.restoreTarget(this.collection.entry.chapters,
                                                  chapter => chapter.sections);

    return parent && parent.restoreSection(this, {position});
  },

  restoreTarget(parents, getChildren) {
    const origin = parents.findWhere({permaId: this.get('originPermaId')});

    if (origin) {
      return {parent: origin, position: this.get('originPosition')};
    }

    const parent = parents.first();

    return {
      parent,
      position: parent && Math.max(-1, ...getChildren(parent).pluck('position')) + 1
    };
  }
});
