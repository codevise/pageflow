import {ScrolledEntry} from 'editor/models/ScrolledEntry';

import {setupGlobals} from 'pageflow/testHelpers';
import {factories, normalizeSeed, useFakeXhr} from 'support';

describe('ScrolledEntry#extractSectionsToFragmentLibrary', () => {
  let testContext;

  beforeEach(() => {
    testContext = {};
    testContext.entry = factories.entry(ScrolledEntry, {id: 1}, {
      entryTypeSeed: normalizeSeed({
        sections: [{id: 10}, {id: 11}]
      })
    });
  });

  setupGlobals({
    entry: () => testContext.entry
  });

  useFakeXhr(() => testContext);

  it('posts to section fragment extractions of entry', () => {
    const {entry, requests} = testContext;

    entry.extractSectionsToFragmentLibrary([entry.sections.get(10)]);

    expect(requests[0].method).toBe('POST');
    expect(requests[0].url)
      .toBe('/editor/entries/1/scrolled/section_fragment_extractions');
  });

  it('posts ids of sections and title', () => {
    const {entry, requests} = testContext;

    entry.extractSectionsToFragmentLibrary([entry.sections.get(10), entry.sections.get(11)],
                                           {title: 'Intro'});

    expect(new URLSearchParams(requests[0].requestBody).getAll('section_ids[]'))
      .toEqual(['10', '11']);
    expect(new URLSearchParams(requests[0].requestBody).get('title')).toEqual('Intro');
  });

  it('resolves once library responds without body', async () => {
    const {entry, server} = testContext;

    const extraction = entry.extractSectionsToFragmentLibrary([entry.sections.get(10)]);
    server.respond(
      'POST', '/editor/entries/1/scrolled/section_fragment_extractions',
      [201, {}, '']
    );

    await expect(extraction).resolves.toBeUndefined();
  });
});
