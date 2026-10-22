import Backbone from 'backbone';

import {Scale} from '../../shared/Scale';

export const TrashItem = Backbone.Model.extend({
  firstSectionPermaId() {
    return this.get('sections')[0]?.permaId;
  },

  seed(entrySeed) {
    const sections = this.get('sections');
    const previewSection = this.get('kind') === 'contentElements' ?
                           withContentElementsPreviewConfiguration(entrySeed) :
                           section => section;

    return {
      ...entrySeed,
      collections: {
        ...entrySeed.collections,
        sections: sections.map(({contentElements, ...section}) => previewSection(section)),
        contentElements: sections.flatMap(section => section.contentElements)
      }
    };
  },

  restore() {
    const {target, restoreInto} = kinds[this.get('kind')];
    const {parent, position} = target(this.collection.entry, this);

    if (!parent) {
      return Promise.reject(new Error('Nothing to restore into.'));
    }

    return restoreInto(parent, this, position).then(restored => {
      this.collection.remove(this);
      return restored;
    });
  },

  permanentlyDelete() {
    return Promise.resolve(this.destroy({wait: true}));
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

const kinds = {
  chapter: {
    target: (entry, trashItem) => ({
      parent: entry.storylines.findWhere({permaId: trashItem.get('originPermaId')})
    }),
    restoreInto: (storyline, trashItem) => whenSynced(storyline.restoreChapter(trashItem))
  },
  section: {
    target: (entry, trashItem) =>
      trashItem.restoreTarget(entry.chapters, chapter => chapter.sections),
    restoreInto: (chapter, trashItem, position) =>
      whenSynced(chapter.restoreSection(trashItem, {position}))
  },
  contentElements: {
    target: (entry, trashItem) =>
      trashItem.restoreTarget(entry.sections, section => section.contentElements),
    restoreInto: (section, trashItem, position) =>
      section.restoreContentElements(trashItem, {position})
  }
};

function whenSynced(model) {
  return new Promise((resolve, reject) => {
    model.once('sync', () => resolve(model));
    model.once('error', reject);
  });
}

function withContentElementsPreviewConfiguration(entrySeed) {
  const themeProperties = entrySeed.config.theme?.options?.properties || {};
  const scale = scaleName => Scale({scaleName, themeProperties, scaleTranslations: {}});

  const previewConfiguration = {
    fullHeight: true,
    paddingTop: smallestNonZeroValue(scale('sectionPaddingTop')),
    paddingBottom: smallestNonZeroValue(scale('sectionPaddingBottom'))
  };

  return section => ({
    ...section,
    configuration: {...section.configuration, ...previewConfiguration}
  });
}

function smallestNonZeroValue({values, cssValues}) {
  const index = cssValues.findIndex(cssValue => parseFloat(cssValue) !== 0);
  return values[index >= 0 ? index : 0];
}
