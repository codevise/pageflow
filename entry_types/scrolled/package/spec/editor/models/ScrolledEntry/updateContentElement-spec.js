import {editor} from 'pageflow-scrolled/editor';
import {ScrolledEntry} from 'editor/models/ScrolledEntry';
import {factories, setupGlobals} from 'pageflow/testHelpers';
import {useFakeXhr, normalizeSeed} from 'support';

describe('ScrolledEntry', () => {
  let testContext;

  beforeAll(() => editor.contentElementTypes.register('textBlock', {}));

  beforeEach(() => {
    testContext = {};
  });

  describe('#updateContentElement', () => {
    useFakeXhr(() => testContext);

    beforeEach(() => {
      testContext.entry = factories.entry(ScrolledEntry, {id: 100}, {
        entryTypeSeed: normalizeSeed({
          contentElements: [
            {id: 1, permaId: 10, typeName: 'textBlock',
             configuration: {value: 'old'}}
          ]
        })
      });
    });

    setupGlobals({
      entry: () => testContext.entry
    });

    function withThreads(entry, commentThreads) {
      entry.reviewSession = factories.reviewSession({commentThreads});
    }

    it('sends configuration change to content element update endpoint', () => {
      const {entry, requests} = testContext;

      entry.updateContentElement(
        entry.contentElements.get(1),
        {value: 'new'}
      );

      expect(requests[0].method).toBe('PUT');
      expect(requests[0].url).toBe(
        '/editor/entries/100/scrolled/content_elements/1'
      );
      expect(JSON.parse(requests[0].requestBody)).toEqual({
        content_element: {configuration: {value: 'new'}}
      });
    });

    it('applies configuration to content element immediately', () => {
      const {entry} = testContext;

      entry.updateContentElement(
        entry.contentElements.get(1),
        {value: 'new'}
      );

      expect(entry.contentElements.get(1).configuration.get('value'))
        .toBe('new');
    });

    it('includes only changed comment_thread_subject_ranges in request body', () => {
      const unchangedRange = {
        anchor: {path: [0, 0], offset: 5},
        focus: {path: [0, 0], offset: 8}
      };

      const {entry, requests} = testContext;
      withThreads(entry, [
        {id: 7, subjectType: 'ContentElement', subjectId: 10,
         subjectRange: {anchor: {path: [0, 0], offset: 0},
                        focus: {path: [0, 0], offset: 3}},
         comments: []},
        {id: 8, subjectType: 'ContentElement', subjectId: 10,
         subjectRange: unchangedRange,
         comments: []}
      ]);

      entry.updateContentElement(
        entry.contentElements.get(1),
        {value: 'new'},
        {
          commentThreadSubjectRanges: {
            '7': {anchor: {path: [0, 0], offset: 1},
                  focus: {path: [0, 0], offset: 4}},
            '8': unchangedRange
          }
        }
      );

      expect(JSON.parse(requests[0].requestBody).comment_thread_subject_ranges)
        .toEqual({
          '7': {anchor: {path: [0, 0], offset: 1},
                focus: {path: [0, 0], offset: 4}}
        });
    });

    it('omits comment_thread_subject_ranges when nothing changed', () => {
      const range = {
        anchor: {path: [0, 0], offset: 0},
        focus: {path: [0, 0], offset: 3}
      };
      const {entry, requests} = testContext;
      withThreads(entry, [
        {id: 7, subjectType: 'ContentElement', subjectId: 10,
         subjectRange: range,
         comments: []}
      ]);

      entry.updateContentElement(
        entry.contentElements.get(1),
        {value: 'new'},
        {commentThreadSubjectRanges: {'7': range}}
      );

      expect(JSON.parse(requests[0].requestBody))
        .not.toHaveProperty('comment_thread_subject_ranges');
    });

    it('applies changed ranges to review session state immediately', () => {
      const {entry} = testContext;
      withThreads(entry, [
        {id: 7, subjectType: 'ContentElement', subjectId: 10,
         subjectRange: {anchor: {path: [0, 0], offset: 0},
                        focus: {path: [0, 0], offset: 3}},
         comments: []}
      ]);

      entry.updateContentElement(
        entry.contentElements.get(1),
        {value: 'new'},
        {
          commentThreadSubjectRanges: {
            '7': {anchor: {path: [0, 0], offset: 1},
                  focus: {path: [0, 0], offset: 4}}
          }
        }
      );

      const thread = entry.reviewSession.state.commentThreads
                          .find(t => t.id === 7);
      expect(thread.subjectRange).toEqual({
        anchor: {path: [0, 0], offset: 1},
        focus: {path: [0, 0], offset: 4}
      });
    });

    it('emits change:thread on review session for each changed range', () => {
      const {entry} = testContext;
      withThreads(entry, [
        {id: 7, subjectType: 'ContentElement', subjectId: 10,
         subjectRange: {anchor: {path: [0, 0], offset: 0},
                        focus: {path: [0, 0], offset: 3}},
         comments: []}
      ]);
      const listener = jest.fn();
      entry.reviewSession.on('change:thread', listener);

      entry.updateContentElement(
        entry.contentElements.get(1),
        {value: 'new'},
        {
          commentThreadSubjectRanges: {
            '7': {anchor: {path: [0, 0], offset: 1},
                  focus: {path: [0, 0], offset: 4}}
          }
        }
      );

      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({id: 7})
      );
    });

    it('works without review session when no ranges are passed', () => {
      const {entry} = testContext;
      entry.reviewSession = undefined;

      expect(() => {
        entry.updateContentElement(
          entry.contentElements.get(1),
          {value: 'new'}
        );
      }).not.toThrow();
    });
  });
});
