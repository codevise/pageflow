import {ScrolledEntry} from 'editor/models/ScrolledEntry';
import {factories} from 'pageflow/testHelpers';
import {normalizeSeed} from 'support';

describe('SectionsCollection', () => {
  describe('comparator', () => {
    it('orders sections from main storyline before sections from excursions', () => {
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

      expect(entry.sections.at(0).id).toBe(10);
      expect(entry.sections.at(1).id).toBe(11);
      expect(entry.sections.at(2).id).toBe(12);
    });

    it('orders sections within same storyline by position', () => {
      const entry = factories.entry(ScrolledEntry, {}, {
        entryTypeSeed: normalizeSeed({
          storylines: [
            {id: 100, configuration: {main: true}}
          ],
          chapters: [
            {id: 1, storylineId: 100}
          ],
          sections: [
            {id: 10, position: 2, chapterId: 1},
            {id: 11, position: 0, chapterId: 1},
            {id: 12, position: 1, chapterId: 1}
          ]
        })
      });

      expect(entry.sections.at(0).id).toBe(11);
      expect(entry.sections.at(1).id).toBe(12);
      expect(entry.sections.at(2).id).toBe(10);
    });

    it('orders sections by chapter position within main storyline', () => {
      const entry = factories.entry(ScrolledEntry, {}, {
        entryTypeSeed: normalizeSeed({
          storylines: [
            {id: 100, configuration: {main: true}}
          ],
          chapters: [
            {id: 1, position: 0, storylineId: 100},
            {id: 2, position: 1, storylineId: 100}
          ],
          sections: [
            {id: 10, position: 0, chapterId: 2},
            {id: 11, position: 0, chapterId: 1}
          ]
        })
      });

      expect(entry.sections.at(0).id).toBe(11);
      expect(entry.sections.at(1).id).toBe(10);
    });
  });
});