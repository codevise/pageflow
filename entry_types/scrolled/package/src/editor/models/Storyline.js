import Backbone from 'backbone';

import {
  configurationContainer,
  ForeignKeySubsetCollection
} from 'pageflow/editor';

import {Chapter} from './Chapter';

export const Storyline = Backbone.Model.extend({
  mixins: [
    configurationContainer({
      includeAttributesInJSON: ['position']
    })
  ],

  initialize(attributes, options) {
    this.chapters = new ForeignKeySubsetCollection({
      parent: options.chapters,
      parentModel: this,
      foreignKeyAttribute: 'storylineId',
      parentReferenceAttribute: 'storyline',
      autoConsolidatePositions: false
    });
    this.entry = options.entry;
  },

  addChapter(attributes) {
    return this.chapters.create({
      position: this.chapters.length ? Math.max(...this.chapters.pluck('position')) + 1 : 0,
      storylineId: this.id,
      ...attributes
    }, {
      entry: this.entry,
      sections: this.entry.sections
    });
  },

  restoreChapter(trashItem) {
    const position = trashItem.get('originPosition');

    const chapter = this.chapters.create(
      new Chapter({position, storylineId: this.id}, {
        entry: this.entry,
        sections: this.entry.sections
      }),
      {
        url: `${trashItem.url()}/restore`,
        wait: true,
        success: () => {
          this.chapters.each(sibling => {
            if (sibling !== chapter && sibling.get('position') >= position) {
              sibling.set('position', sibling.get('position') + 1);
            }
          });

          this.chapters.sort();
        }
      }
    );

    chapter.once('sync', (model, response) => {
      chapter.configuration.set(response.configuration, {autoSave: false});

      response.sections.forEach(({contentElements, ...attributes}) => {
        chapter.sections.add(attributes, {contentElements: this.entry.contentElements});
        this.entry.contentElements.add(contentElements);
      });

      if (chapter.sections.length) {
        this.entry.trigger('selectSection', chapter.sections.first());
        this.entry.trigger('scrollToSection', chapter.sections.first());
      }
    });

    return chapter;
  },

  appendChapter(chapter) {
    const position = this.chapters.length ?
                     Math.max(...this.chapters.pluck('position')) + 1 :
                     0;

    chapter.set('position', position);
    this.chapters.add(chapter);
    this.chapters.sort();
    this.chapters.saveOrder();
  },

  isMain() {
    return this.get('role') === 'main';
  }
});
