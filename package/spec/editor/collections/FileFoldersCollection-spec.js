import {FileFoldersCollection} from 'pageflow/editor';

import * as support from '$support';

describe('FileFoldersCollection', () => {
  const f = support.factories;

  let testContext;

  beforeEach(() => {
    testContext = {};
  });

  function collection(folders) {
    return new FileFoldersCollection(folders, {entry: f.entry()});
  }

  it('sorts folders by name ignoring case', () => {
    const fileFolders = collection([
      {perma_id: 1, name: 'raw'},
      {perma_id: 2, name: 'Interviews'}
    ]);

    expect(fileFolders.pluck('name')).toEqual(['Interviews', 'raw']);
  });

  describe('#byPermaId', () => {
    it('finds folder by perma id', () => {
      const fileFolders = collection([{perma_id: 5, name: 'Interviews'}]);

      expect(fileFolders.byPermaId(5).get('name')).toEqual('Interviews');
    });

    it('finds folder by perma id given as string', () => {
      const fileFolders = collection([{perma_id: 5, name: 'Interviews'}]);

      expect(fileFolders.byPermaId('5').get('name')).toEqual('Interviews');
    });

    it('returns undefined for unknown perma id', () => {
      const fileFolders = collection([{perma_id: 5, name: 'Interviews'}]);

      expect(fileFolders.byPermaId(6)).toBeUndefined();
    });

    it('returns undefined for blank perma id', () => {
      const fileFolders = collection([{perma_id: 5, name: 'Interviews'}]);

      expect(fileFolders.byPermaId(null)).toBeUndefined();
      expect(fileFolders.byPermaId(undefined)).toBeUndefined();
      expect(fileFolders.byPermaId('')).toBeUndefined();
    });
  });

  describe('#childrenOf', () => {
    it('returns folders nested inside given folder', () => {
      const fileFolders = collection([
        {perma_id: 1, name: 'Interviews'},
        {perma_id: 2, name: 'Raw', parent_folder_perma_id: 1},
        {perma_id: 3, name: 'Cut', parent_folder_perma_id: 1},
        {perma_id: 4, name: 'Landscapes'}
      ]);

      const children = fileFolders.childrenOf(fileFolders.byPermaId(1));

      expect(children.map(folder => folder.get('name'))).toEqual(['Cut', 'Raw']);
    });

    it('returns folders without parent when passed nothing', () => {
      const fileFolders = collection([
        {perma_id: 1, name: 'Interviews'},
        {perma_id: 2, name: 'Raw', parent_folder_perma_id: 1},
        {perma_id: 4, name: 'Landscapes'}
      ]);

      const children = fileFolders.childrenOf();

      expect(children.map(folder => folder.get('name'))).toEqual(['Interviews', 'Landscapes']);
    });
  });

  describe('#parentOf', () => {
    it('returns folder the given folder is nested in', () => {
      const fileFolders = collection([
        {perma_id: 1, name: 'Interviews'},
        {perma_id: 2, name: 'Raw', parent_folder_perma_id: 1}
      ]);

      expect(fileFolders.parentOf(fileFolders.byPermaId(2)).get('name')).toEqual('Interviews');
    });

    it('returns undefined for folder without parent', () => {
      const fileFolders = collection([{perma_id: 1, name: 'Interviews'}]);

      expect(fileFolders.parentOf(fileFolders.byPermaId(1))).toBeUndefined();
    });
  });

  describe('#descendantPermaIdsOf', () => {
    it('includes perma ids of folder and all folders below it', () => {
      const fileFolders = collection([
        {perma_id: 1, name: 'Interviews'},
        {perma_id: 2, name: 'Raw', parent_folder_perma_id: 1},
        {perma_id: 3, name: 'Takes', parent_folder_perma_id: 2},
        {perma_id: 4, name: 'Landscapes'}
      ]);

      const permaIds = fileFolders.descendantPermaIdsOf(fileFolders.byPermaId(1));

      expect(permaIds.sort()).toEqual([1, 2, 3]);
    });

    it('returns own perma id for folder without children', () => {
      const fileFolders = collection([{perma_id: 1, name: 'Interviews'}]);

      expect(fileFolders.descendantPermaIdsOf(fileFolders.byPermaId(1))).toEqual([1]);
    });

    it('stops at folders which are their own descendants', () => {
      const fileFolders = collection([
        {perma_id: 1, name: 'Interviews', parent_folder_perma_id: 2},
        {perma_id: 2, name: 'Raw', parent_folder_perma_id: 1}
      ]);

      const permaIds = fileFolders.descendantPermaIdsOf(fileFolders.byPermaId(1));

      expect(permaIds.sort()).toEqual([1, 2]);
    });
  });

  describe('#ancestorsOf', () => {
    it('returns folders the given folder is nested in from outermost to innermost', () => {
      const fileFolders = collection([
        {perma_id: 1, name: 'Interviews'},
        {perma_id: 2, name: 'Raw', parent_folder_perma_id: 1},
        {perma_id: 3, name: 'Takes', parent_folder_perma_id: 2}
      ]);

      const ancestors = fileFolders.ancestorsOf(fileFolders.byPermaId(3));

      expect(ancestors.map(folder => folder.get('name'))).toEqual(['Interviews', 'Raw']);
    });

    it('returns empty list for folder without parent', () => {
      const fileFolders = collection([{perma_id: 1, name: 'Interviews'}]);

      expect(fileFolders.ancestorsOf(fileFolders.byPermaId(1))).toEqual([]);
    });

    it('stops at folders which are their own ancestors', () => {
      const fileFolders = collection([
        {perma_id: 1, name: 'Interviews', parent_folder_perma_id: 2},
        {perma_id: 2, name: 'Raw', parent_folder_perma_id: 1}
      ]);

      const ancestors = fileFolders.ancestorsOf(fileFolders.byPermaId(1));

      expect(ancestors.map(folder => folder.get('name'))).toEqual(['Interviews', 'Raw']);
    });
  });

  describe('persistence', () => {
    support.useFakeXhr(() => testContext);

    it('creates folders via editor api', () => {
      const fileFolders = collection([]);

      fileFolders.create({name: 'Interviews'});

      expect(testContext.requests[0].method).toEqual('POST');
      expect(testContext.requests[0].url).toEqual('/editor/entries/1/file_folders');
      expect(JSON.parse(testContext.requests[0].requestBody))
        .toEqual({file_folder: {name: 'Interviews', parent_folder_perma_id: null}});
    });

    it('updates folder via editor api when name changes', () => {
      const fileFolders = collection([{id: 5, perma_id: 1, name: 'Interviews'}]);

      fileFolders.first().set('name', 'Portraits');

      expect(testContext.requests[0].method).toEqual('PUT');
      expect(testContext.requests[0].url).toEqual('/editor/entries/1/file_folders/5');
      expect(JSON.parse(testContext.requests[0].requestBody))
        .toEqual({file_folder: {id: 5,
                                perma_id: 1,
                                name: 'Portraits',
                                parent_folder_perma_id: null}});
    });

    it('updates folder via editor api when parent changes', () => {
      const fileFolders = collection([{id: 5, perma_id: 1, name: 'Interviews'},
                                      {id: 6, perma_id: 2, name: 'Portraits'}]);

      fileFolders.byPermaId(1).set('parent_folder_perma_id', 2);

      expect(testContext.requests[0].method).toEqual('PUT');
      expect(testContext.requests[0].url).toEqual('/editor/entries/1/file_folders/5');
      expect(JSON.parse(testContext.requests[0].requestBody))
        .toEqual({file_folder: {id: 5,
                                perma_id: 1,
                                name: 'Interviews',
                                parent_folder_perma_id: 2}});
    });

    it('does not update folder which has not been created yet', () => {
      const fileFolders = collection([]);
      const folder = fileFolders.addAndReturnModel({name: 'Interviews'});

      folder.set('name', 'Portraits');

      expect(testContext.requests).toEqual([]);
    });

    it('destroys folder via editor api', () => {
      const fileFolders = collection([{id: 5, perma_id: 1, name: 'Interviews'}]);

      fileFolders.first().destroy();

      expect(testContext.requests[0].method).toEqual('DELETE');
      expect(testContext.requests[0].url).toEqual('/editor/entries/1/file_folders/5');
    });

    it('keeps folder in collection until destroy request succeeded', () => {
      const fileFolders = collection([{id: 5, perma_id: 1, name: 'Interviews'}]);

      fileFolders.first().destroy();

      expect(fileFolders.length).toEqual(1);

      testContext.requests[0].respond(204, {}, '');

      expect(fileFolders.length).toEqual(0);
    });
  });
});
