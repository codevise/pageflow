import 'pageflow-scrolled/editor';
import {ScrolledEntry} from 'editor/models/ScrolledEntry';
import {factories, setupGlobals} from 'pageflow/testHelpers';
import {normalizeSeed} from 'support';

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
});
