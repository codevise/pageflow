import 'pageflow-scrolled/editor';
import {ScrolledEntry} from 'editor/models/ScrolledEntry';
import {factories, setupGlobals} from 'pageflow/testHelpers';
import {normalizeSeed} from 'support';

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
  });
});
