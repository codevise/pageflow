import {ScrolledEntry} from 'editor/models/ScrolledEntry';

import {setupGlobals} from 'pageflow/testHelpers';
import {factories, normalizeSeed, useFakeXhr} from 'support';

describe('ScrolledEntry#extractContentElementsToFragmentLibrary', () => {
  let testContext;

  beforeEach(() => {
    testContext = {};
    testContext.entry = factories.entry(ScrolledEntry, {id: 1}, {
      entryTypeSeed: normalizeSeed({
        contentElements: [{id: 20}, {id: 21}]
      })
    });
  });

  setupGlobals({
    entry: () => testContext.entry
  });

  useFakeXhr(() => testContext);

  it('posts to content element fragment extractions of entry', () => {
    const {entry, requests} = testContext;

    entry.extractContentElementsToFragmentLibrary([{id: 20}, {id: 21}]);

    expect(requests[0].method).toBe('POST');
    expect(requests[0].url)
      .toBe('/editor/entries/1/scrolled/content_element_fragment_extractions');
  });

  it('posts ids of content elements and title', () => {
    const {entry, requests} = testContext;

    entry.extractContentElementsToFragmentLibrary([{id: 20}, {id: 21}], {title: 'Quote'});

    expect(new URLSearchParams(requests[0].requestBody).getAll('content_element_ids[]'))
      .toEqual(['20', '21']);
    expect(new URLSearchParams(requests[0].requestBody).get('title')).toEqual('Quote');
  });

  it('resolves once library responds without body', async () => {
    const {entry, server} = testContext;

    const extraction = entry.extractContentElementsToFragmentLibrary([{id: 20}]);
    server.respond(
      'POST', '/editor/entries/1/scrolled/content_element_fragment_extractions',
      [201, {}, '']
    );

    await expect(extraction).resolves.toBeUndefined();
  });
});
