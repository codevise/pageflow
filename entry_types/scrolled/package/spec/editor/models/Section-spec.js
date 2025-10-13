import {ScrolledEntry} from 'editor/models/ScrolledEntry';
import {factories} from 'pageflow/testHelpers';
import {normalizeSeed} from 'support';

describe('Section', () => {
  describe('getTransition', () => {
    it('returns transition from configuration', () => {
      const entry = factories.entry(ScrolledEntry, {}, {
        entryTypeSeed: normalizeSeed({
          sections: [
            {id: 10, position: 0},
            {id: 11, position: 1, configuration: {transition: 'reveal'}}
          ]
        })
      });
      const section = entry.sections.get(11);

      expect(section.getTransition()).toEqual('reveal');
    });

    it('turns fade into scroll if fade transition is not available', () => {
      const entry = factories.entry(ScrolledEntry, {}, {
        entryTypeSeed: normalizeSeed({
          sections: [
            {id: 10, position: 0, configuration: {fullHeight: false}},
            {id: 11, position: 1, configuration: {transition: 'fade', fullHeight: true}}
          ]
        })
      });
      const section = entry.sections.get(11);

      expect(section.getTransition()).toEqual('scroll');
    });

    it('keeps fade if fade transition is available', () => {
      const entry = factories.entry(ScrolledEntry, {}, {
        entryTypeSeed: normalizeSeed({
          sections: [
            {id: 10, position: 0, configuration: {fullHeight: true}},
            {id: 11, position: 1, configuration: {transition: 'fade', fullHeight: true}}
          ]
        })
      });
      const section = entry.sections.get(11);

      expect(section.getTransition()).toEqual('fade');
    });
  });

  describe('isCurrent', () => {
    it('returns true when section index matches current section index in main storyline', () => {
      const entry = factories.entry(ScrolledEntry, {}, {
        entryTypeSeed: normalizeSeed({
          storylines: [
            {id: 100, configuration: {main: true}},
            {id: 200}
          ],
          chapters: [
            {id: 1, storylineId: 100},
            {id: 2, storylineId: 200}
          ],
          sections: [
            {id: 10, position: 0, chapterId: 1},
            {id: 11, position: 2, chapterId: 1},
            {id: 12, position: 1, chapterId: 2}
          ]
        })
      });
      const section = entry.sections.get(11);
      entry.set('currentSectionIndex', 1);

      expect(section.isCurrent()).toBe(true);
    });

    it('returns false when section index does not match current section index', () => {
      const entry = factories.entry(ScrolledEntry, {}, {
        entryTypeSeed: normalizeSeed({
          sections: [
            {id: 10, position: 0},
            {id: 11, position: 1},
            {id: 12, position: 2}
          ]
        })
      });
      const section = entry.sections.get(11);
      entry.set('currentSectionIndex', 0);

      expect(section.isCurrent()).toBe(false);
    });

    it('returns true when in excursion and section index within chapter matches', () => {
      const entry = factories.entry(ScrolledEntry, {}, {
        entryTypeSeed: normalizeSeed({
          storylines: [
            {id: 100, configuration: {main: true}},
            {id: 200}
          ],
          chapters: [
            {id: 1, storylineId: 100},
            {id: 2, storylineId: 200}
          ],
          sections: [
            {id: 10, position: 0, chapterId: 1},
            {id: 11, position: 1, chapterId: 2},
            {id: 12, position: 2, chapterId: 2},
            {id: 13, position: 3, chapterId: 2}
          ]
        })
      });
      const section = entry.sections.get(12);
      entry.set('currentExcursionId', 2);
      entry.set('currentSectionIndex', 1);

      expect(section.isCurrent()).toBe(true);
    });

    it('returns false when in excursion but not the current section in that chapter', () => {
      const entry = factories.entry(ScrolledEntry, {}, {
        entryTypeSeed: normalizeSeed({
          storylines: [
            {id: 100, configuration: {main: true}},
            {id: 200}
          ],
          chapters: [
            {id: 1, storylineId: 100},
            {id: 2, storylineId: 200}
          ],
          sections: [
            {id: 10, position: 0, chapterId: 1},
            {id: 11, position: 1, chapterId: 2},
            {id: 12, position: 2, chapterId: 2},
            {id: 13, position: 3, chapterId: 2}
          ]
        })
      });
      const section = entry.sections.get(11);
      entry.set('currentExcursionId', 2);
      entry.set('currentSectionIndex', 1);

      expect(section.isCurrent()).toBe(false);
    });

    it('returns false when in excursion but section belongs to different chapter', () => {
      const entry = factories.entry(ScrolledEntry, {}, {
        entryTypeSeed: normalizeSeed({
          storylines: [
            {id: 100, configuration: {main: true}},
            {id: 200}
          ],
          chapters: [
            {id: 1, storylineId: 100},
            {id: 2, storylineId: 200}
          ],
          sections: [
            {id: 10, position: 0, chapterId: 1},
            {id: 11, position: 1, chapterId: 2},
            {id: 12, position: 2, chapterId: 2}
          ]
        })
      });
      const section = entry.sections.get(10);
      entry.set('currentExcursionId', 2);
      entry.set('currentSectionIndex', 0);

      expect(section.isCurrent()).toBe(false);
    });
  });
});
