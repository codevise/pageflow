import 'pageflow-scrolled/editor';
import {ScrolledEntry} from 'editor/models/ScrolledEntry';
import {factories, setupGlobals} from 'pageflow/testHelpers';
import {normalizeSeed, useFakeXhr} from 'support';

describe('Storyline', () => {
  let testContext;

  beforeEach(() => {
    testContext = {};
  });

  describe('#addChapter', () => {
    beforeEach(() => {
      testContext.entry = factories.entry(ScrolledEntry, {}, {
        entryTypeSeed: normalizeSeed({
          storylines: [{id: 10}],
          chapters: [{storylineId: 10, position: 5}]
        })
      });
    });

    setupGlobals({
      entry: () => testContext.entry
    });

    it('adds chapter to storyline with position', () => {
      const {entry} = testContext;
      const storyline = entry.storylines.main();

      const chapter = storyline.addChapter();

      expect(storyline.chapters.length).toEqual(2);
      expect(chapter.get('position')).toEqual(6);
    });
  });

  describe('#appendChapter', () => {
    useFakeXhr(() => testContext);

    beforeEach(() => {
      testContext.entry = factories.entry(ScrolledEntry, {}, {
        entryTypeSeed: normalizeSeed({
          storylines: [{id: 10}, {id: 20}],
          chapters: [
            {id: 1, storylineId: 10, position: 0},
            {id: 2, storylineId: 10, position: 1},
            {id: 3, storylineId: 20, position: 0}
          ]
        })
      });
    });

    setupGlobals({
      entry: () => testContext.entry
    });

    it('moves chapter to end of storyline', () => {
      const {entry} = testContext;
      const sourceStoryline = entry.storylines.get(10);
      const targetStoryline = entry.storylines.get(20);
      const chapter = entry.chapters.get(1);

      targetStoryline.appendChapter(chapter);

      expect(sourceStoryline.chapters.length).toEqual(1);
      expect(targetStoryline.chapters.length).toEqual(2);
      expect(chapter.get('position')).toEqual(1);
    });

    it('sets position to 0 for empty storyline', () => {
      const entry = factories.entry(ScrolledEntry, {}, {
        entryTypeSeed: normalizeSeed({
          storylines: [{id: 10}, {id: 20}],
          chapters: [
            {id: 1, storylineId: 10, position: 0}
          ]
        })
      });
      const chapter = entry.chapters.get(1);

      entry.storylines.excursions().appendChapter(chapter);

      expect(chapter.get('position')).toEqual(0);
    });
  });
});
