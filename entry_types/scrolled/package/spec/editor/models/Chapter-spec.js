import 'pageflow-scrolled/editor';
import {ScrolledEntry} from 'editor/models/ScrolledEntry';
import {factories, setupGlobals} from 'pageflow/testHelpers';
import {useFakeXhr, normalizeSeed} from 'support';

describe('Chapter', () => {
  let testContext;

  beforeEach(() => {
    testContext = {};
  });

  describe('#addSection', () => {
    beforeEach(() => {
      testContext.entry = factories.entry(ScrolledEntry, {}, {
        entryTypeSeed: normalizeSeed({
          chapters: [{id: 10}]
        })
      });
    });

    setupGlobals({
      entry: () => testContext.entry
    });

    it('uses default transition from entry metadata configuration', () => {
      const {entry} = testContext;

      entry.metadata.configuration.set('defaultTransition', 'beforeAfter');
      const section = entry.chapters.first().addSection();

      expect(section.configuration.get('transition')).toEqual('beforeAfter');
    });

    it('uses default paddingTop from entry metadata configuration', () => {
      const {entry} = testContext;

      entry.metadata.configuration.set('defaultSectionPaddingTop', 'lg');
      const section = entry.chapters.first().addSection();

      expect(section.configuration.get('paddingTop')).toEqual('lg');
    });

    it('uses default paddingBottom from entry metadata configuration', () => {
      const {entry} = testContext;

      entry.metadata.configuration.set('defaultSectionPaddingBottom', 'sm');
      const section = entry.chapters.first().addSection();

      expect(section.configuration.get('paddingBottom')).toEqual('sm');
    });

    it('uses default layout from entry metadata configuration', () => {
      const {entry} = testContext;

      entry.metadata.configuration.set('defaultSectionLayout', 'right');
      const section = entry.chapters.first().addSection();

      expect(section.configuration.get('layout')).toEqual('right');
    });

    it('handles sparse positions correctly', () => {
      const {entry} = testContext;

      const chapter = entry.chapters.first()
      const firstSection = chapter.addSection();
      chapter.addSection();
      firstSection.destroy();
      chapter.addSection();

      expect(chapter.sections.pluck('position')).toEqual([1, 2]);
    });
  });

  describe('#insertSection', () => {
    beforeEach(() => {
      testContext.entry = factories.entry(ScrolledEntry, {}, {
        entryTypeSeed: normalizeSeed({
          chapters: [{id: 10}],
          sections: [
            {id: 100, chapterId: 10, position: 0},
            {id: 101, chapterId: 10, position: 1}
          ]
        })
      });
    });

    setupGlobals({
      entry: () => testContext.entry
    });

    it('re-indexes pages when inserting before other section', () => {
      const {entry} = testContext;
      const chapter = entry.chapters.first();

      chapter.insertSection({before: chapter.sections.last()});

      expect(chapter.sections.pluck('position')).toEqual([0, 1, 2]);
      expect(chapter.sections.pluck('id')).toEqual([100, undefined, 101]);
    });

    it('re-indexes pages when inserting after other section', () => {
      const {entry} = testContext;
      const chapter = entry.chapters.first();

      chapter.insertSection({after: chapter.sections.first()});

      expect(chapter.sections.pluck('position')).toEqual([0, 1, 2]);
      expect(chapter.sections.pluck('id')).toEqual([100, undefined, 101]);
    });

    describe('with sparse positions', () => {
      beforeEach(() => {
        testContext.entry = factories.entry(ScrolledEntry, {}, {
          entryTypeSeed: normalizeSeed({
            chapters: [{id: 10}],
            sections: [
              {id: 100, chapterId: 10, position: 7},
              {id: 101, chapterId: 10, position: 8}
            ]
          })
        });
      });

      it('re-indexes pages when inserting after other section', () => {
        const {entry} = testContext;
        const chapter = entry.chapters.first();

        chapter.insertSection({after: chapter.sections.first()});

        expect(chapter.sections.pluck('position')).toEqual([7, 8, 9]);
        expect(chapter.sections.pluck('id')).toEqual([100, undefined, 101]);
      });
    });
  });

  describe('#duplicateSection', () => {
    beforeEach(() => {
      testContext.entry = factories.entry(ScrolledEntry, {id: 1}, {
        entryTypeSeed: normalizeSeed({
          chapters: [{id: 10}],
          sections: [
            {id: 100, chapterId: 10, position: 0, configuration: {transition: 'scroll'}},
            {id: 101, chapterId: 10, position: 1}
          ],
          contentElements: [
            {id: 1000, permaId: 1, sectionId: 101, position: 0, typeName: 'inlineImage'},
            {id: 1001, permaId: 2, sectionId: 101, position: 1, typeName: 'textBlock'}
          ]
        })
      });
    });

    setupGlobals({
      entry: () => testContext.entry
    });

    useFakeXhr(() => testContext);

    it('re-indexes pages when inserting before other section', () => {
      const {entry} = testContext;
      const chapter = entry.chapters.first();

      chapter.duplicateSection(chapter.sections.first());

      expect(chapter.sections.pluck('position')).toEqual([0, 1, 2]);
      expect(chapter.sections.pluck('id')).toEqual([100, undefined, 101]);
    });

    it('posts requests to duplicate action and adds content elements', () => {
      const {entry, server, requests} = testContext;
      const chapter = entry.chapters.first();

      chapter.duplicateSection(chapter.sections.first());

      expect(requests[0].method).toBe('POST');
      expect(requests[0].url).toBe('/editor/entries/1/scrolled/sections/100/duplicate');

      expect(chapter.sections.pluck('position')).toEqual([0, 1, 2])
      expect(chapter.sections.pluck('id')).toEqual([100, undefined, 101])

      server.respond(
        'POST', '/editor/entries/1/scrolled/sections/100/duplicate',
        [200, {'Content-Type': 'application/json'}, JSON.stringify({
          id: 102,
          configuration: {transition: 'scroll'},
          contentElements: [
            {
              id: 1002,
              permaId: 3,
              sectionId: 102,
              position: 0,
              typeName: 'inlineImage',
              configuration: {image: 5}
            },
            {
              id: 1003,
              permaId: 4,
              sectionId: 102,
              position: 0,
              typeName: 'textBlock',
              configuration: {value: 'Some text'}
            },
          ]
        })]
      );

      expect(requests.length).toEqual(1);
      expect(chapter.sections.pluck('id')).toEqual([100, 102, 101]);
      const section = chapter.sections.get(102);

      expect(section.configuration.get('transition')).toEqual('scroll');
      expect(section.contentElements.pluck('id')).toEqual([1002, 1003]);
      expect(section.contentElements.pluck('typeName')).toEqual(['inlineImage', 'textBlock']);
      expect(section.contentElements.first().configuration.get('image')).toEqual(5);
      expect(section.contentElements.last().configuration.get('value')).toEqual('Some text');
    });

    it('does not use duplicate url on subsequent save', () => {
      const {entry, server, requests} = testContext;
      const chapter = entry.chapters.first();

      const section = chapter.duplicateSection(chapter.sections.first());

      server.respond(
        'POST', '/editor/entries/1/scrolled/sections/100/duplicate',
        [200, {'Content-Type': 'application/json'}, JSON.stringify({
          id: 102,
          configuration: {transition: 'scroll'},
          contentElements: [
            {
              id: 1002,
              permaId: 3,
              sectionId: 102,
              position: 0,
              typeName: 'inlineImage',
              configuration: {image: 5}
            },
            {
              id: 1003,
              permaId: 4,
              sectionId: 102,
              position: 0,
              typeName: 'textBlock',
              configuration: {value: 'Some text'}
            },
          ]
        })]
      );
      section.save();

      expect(requests.length).toEqual(2);
      expect(requests[1].url).toBe('/editor/entries/1/scrolled/sections/102');
    });

    it('does not apply default configuration', () => {
      const {entry} = testContext;
      entry.metadata.configuration.set('defaultSectionLayout', 'right');

      const chapter = entry.chapters.first();
      const section = chapter.duplicateSection(chapter.sections.first());

      expect(section.configuration.get('layout')).toBeUndefined();
    });
  });

  describe('#moveSection', () => {
    describe('within same chapter', () => {
      beforeEach(() => {
        testContext.entry = factories.entry(ScrolledEntry, {}, {
          entryTypeSeed: normalizeSeed({
            chapters: [{id: 10}],
            sections: [
              {id: 100, chapterId: 10, position: 0},
              {id: 101, chapterId: 10, position: 1},
              {id: 102, chapterId: 10, position: 2}
            ]
          })
        });
      });

      setupGlobals({
        entry: () => testContext.entry
      });

      useFakeXhr(() => testContext);

      it('re-indexes sections when moving after another section', () => {
        const {entry} = testContext;
        const chapter = entry.chapters.first();
        const sectionToMove = chapter.sections.get(100);
        const targetSection = chapter.sections.get(102);

        chapter.moveSection(sectionToMove, {after: targetSection});

        expect(chapter.sections.pluck('position')).toEqual([0, 1, 2]);
        expect(chapter.sections.pluck('id')).toEqual([101, 102, 100]);
      });

      it('triggers selectSection and scrollToSection events', () => {
        const {entry} = testContext;
        const chapter = entry.chapters.first();
        const sectionToMove = chapter.sections.get(100);
        const targetSection = chapter.sections.get(102);
        const selectListener = jest.fn();
        const scrollListener = jest.fn();

        entry.on('selectSection', selectListener);
        entry.on('scrollToSection', scrollListener);

        chapter.moveSection(sectionToMove, {after: targetSection});

        expect(selectListener).toHaveBeenCalledWith(sectionToMove);
        expect(scrollListener).toHaveBeenCalledWith(sectionToMove);
      });

      it('calls saveOrder', () => {
        const {entry, requests} = testContext;
        const chapter = entry.chapters.first();
        const sectionToMove = chapter.sections.get(100);
        const targetSection = chapter.sections.get(102);

        chapter.moveSection(sectionToMove, {after: targetSection});

        expect(requests.length).toBe(1);
        expect(requests[0].url).toContain('/order');
      });

      it('re-indexes sections when moving before another section', () => {
        const {entry} = testContext;
        const chapter = entry.chapters.first();
        const sectionToMove = chapter.sections.get(102);
        const targetSection = chapter.sections.get(100);

        chapter.moveSection(sectionToMove, {before: targetSection});

        expect(chapter.sections.pluck('position')).toEqual([0, 1, 2]);
        expect(chapter.sections.pluck('id')).toEqual([102, 100, 101]);
      });
    });

    describe('between chapters', () => {
      beforeEach(() => {
        testContext.entry = factories.entry(ScrolledEntry, {}, {
          entryTypeSeed: normalizeSeed({
            chapters: [{id: 10}, {id: 20}],
            sections: [
              {id: 100, chapterId: 10, position: 0},
              {id: 101, chapterId: 10, position: 1},
              {id: 200, chapterId: 20, position: 0},
              {id: 201, chapterId: 20, position: 1}
            ]
          })
        });
      });

      setupGlobals({
        entry: () => testContext.entry
      });

      useFakeXhr(() => testContext);

      it('moves section to different chapter', () => {
        const {entry} = testContext;
        const sourceChapter = entry.chapters.get(10);
        const targetChapter = entry.chapters.get(20);
        const sectionToMove = sourceChapter.sections.get(100);
        const targetSection = targetChapter.sections.get(200);

        targetChapter.moveSection(sectionToMove, {after: targetSection});

        expect(sectionToMove.get('chapterId')).toBe(20);
        expect(sourceChapter.sections.pluck('id')).toEqual([101]);
        expect(targetChapter.sections.pluck('id')).toEqual([200, 100, 201]);
      });

      it('updates positions in target chapter', () => {
        const {entry} = testContext;
        const sourceChapter = entry.chapters.get(10);
        const targetChapter = entry.chapters.get(20);
        const sectionToMove = sourceChapter.sections.get(100);
        const targetSection = targetChapter.sections.get(200);

        targetChapter.moveSection(sectionToMove, {after: targetSection});

        expect(sourceChapter.sections.pluck('position')).toEqual([1]);
        expect(targetChapter.sections.pluck('position')).toEqual([0, 1, 2]);
      });

      it('calls saveOrder on target chapter', () => {
        const {entry, requests} = testContext;
        const sourceChapter = entry.chapters.get(10);
        const targetChapter = entry.chapters.get(20);
        const sectionToMove = sourceChapter.sections.get(100);
        const targetSection = targetChapter.sections.get(200);

        targetChapter.moveSection(sectionToMove, {after: targetSection});

        expect(requests.length).toBe(1);
        expect(requests[0].url).toContain('/chapters/20/sections/order');
      });

      it('moves section before target section in different chapter', () => {
        const {entry} = testContext;
        const sourceChapter = entry.chapters.get(10);
        const targetChapter = entry.chapters.get(20);
        const sectionToMove = sourceChapter.sections.get(100);
        const targetSection = targetChapter.sections.get(201);

        targetChapter.moveSection(sectionToMove, {before: targetSection});

        expect(sectionToMove.get('chapterId')).toBe(20);
        expect(sourceChapter.sections.pluck('id')).toEqual([101]);
        expect(targetChapter.sections.pluck('id')).toEqual([200, 100, 201]);
      });
    });
  });

  describe('#isExcursion', () => {
    it('returns false for chapters in main storyline', () => {
      const entry = factories.entry(ScrolledEntry, {}, {
        entryTypeSeed: normalizeSeed({
          storylines: [
            {id: 100, configuration: {main: true}}
          ],
          chapters: [
            {id: 1, storylineId: 100}
          ]
        })
      });

      const chapter = entry.chapters.get(1);

      expect(chapter.isExcursion()).toBe(false);
    });

    it('returns true for chapters in excursion storyline', () => {
      const entry = factories.entry(ScrolledEntry, {}, {
        entryTypeSeed: normalizeSeed({
          storylines: [
            {id: 100, configuration: {main: true}},
            {id: 200}
          ],
          chapters: [
            {id: 1, storylineId: 100},
            {id: 2, storylineId: 200}
          ]
        })
      });

      const chapter = entry.chapters.get(2);

      expect(chapter.isExcursion()).toBe(true);
    });
  });

  describe('#toggleExcursion', () => {
    useFakeXhr(() => testContext);

    beforeEach(() => {
      testContext.entry = factories.entry(ScrolledEntry, {}, {
        entryTypeSeed: normalizeSeed({
          storylines: [
            {id: 100, configuration: {main: true}},
            {id: 200}
          ],
          chapters: [
            {id: 1, storylineId: 100, position: 0},
            {id: 2, storylineId: 200, position: 0}
          ]
        })
      });
    });

    setupGlobals({
      entry: () => testContext.entry
    });

    it('moves chapter from main to excursions', () => {
      const {entry} = testContext;
      const chapter = entry.chapters.get(1);

      chapter.toggleExcursion();

      expect(chapter.get('storylineId')).toEqual(200);
      expect(entry.storylines.main().chapters.length).toEqual(0);
      expect(entry.storylines.excursions().chapters.length).toEqual(2);
    });

    it('moves chapter from excursions to main', () => {
      const {entry} = testContext;
      const chapter = entry.chapters.get(2);

      chapter.toggleExcursion();

      expect(chapter.get('storylineId')).toEqual(100);
      expect(entry.storylines.main().chapters.length).toEqual(2);
      expect(entry.storylines.excursions().chapters.length).toEqual(0);
    });
  });
});
