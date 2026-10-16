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
    const {parent, position} = this.restoreTarget(this.collection.entry.chapters,
                                                  chapter => chapter.sections);

    if (!parent) {
      return Promise.reject(new Error('No chapter to restore into.'));
    }

    const section = parent.restoreSection(this, {position});

    return new Promise((resolve, reject) => {
      section.once('sync', () => {
        this.collection.remove(this);
        resolve(section);
      });
      section.once('error', reject);
    });
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
