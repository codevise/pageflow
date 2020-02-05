import Backbone from 'backbone';

import {EditorApi} from 'pageflow/editor';

import * as support from '$support';

describe('SavingRecords', () => {
  describe('#watch', () => {
    let testContext;

    beforeEach(() => {
      testContext = {};
    });

    support.useFakeXhr(() => testContext);

    it('adds records while they are being saved', () => {
      const editor = new EditorApi();
      const collection = new Backbone.Collection();

      editor.savingRecords.watch(collection);
      collection.create({}, {url: '/some/url'});

      expect(editor.savingRecords.isEmpty()).toBe(false);
    });

    it('removes records once saving is done', async () => {
      const editor = new EditorApi();
      const collection = new Backbone.Collection();

      editor.savingRecords.watch(collection);

      collection.create({}, {url: '/'});
      testContext.requests[0].respond(200,
                                      { 'Content-Type': 'application/json' },
                                      '[{ "id": 12 }]');

      expect(editor.savingRecords.isEmpty()).toBe(true);
    });

    it('removes records also if request fails', async () => {
      const editor = new EditorApi();
      const collection = new Backbone.Collection();

      editor.savingRecords.watch(collection);

      collection.create({}, {url: '/'});
      testContext.requests[0].respond(404,
                                      { 'Content-Type': 'application/json' },
                                      '{}');

      expect(editor.savingRecords.isEmpty()).toBe(true);
    });
  });
});
