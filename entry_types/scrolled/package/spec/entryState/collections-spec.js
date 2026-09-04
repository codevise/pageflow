import {collectionsSnapshot, watchCollections} from 'entryState';

import {useEditorGlobals} from 'support';

describe('collectionsSnapshot', () => {
  const {createEntry} = useEditorGlobals();

  function entryWithFiles() {
    return createEntry({
      videoFiles: [{id: 100, perma_id: 5}],
      textTrackFiles: [{id: 200, perma_id: 6,
                        parent_file_id: 100,
                        parent_file_model_type: 'Pageflow::VideoFile'}],
      sections: [{id: 1, permaId: 10, configuration: {backdrop: {image: 5}}}]
    });
  }

  it('maps file attributes to entry state items', () => {
    const collections = collectionsSnapshot(entryWithFiles());

    expect(collections.textTrackFiles).toMatchObject([
      {id: 200, permaId: 6, parentFileId: 100, parentFileModelType: 'Pageflow::VideoFile'}
    ]);
  });

  it('includes configurations of sections', () => {
    const collections = collectionsSnapshot(entryWithFiles());

    expect(collections.sections).toMatchObject([
      {id: 1, permaId: 10, configuration: {backdrop: {image: 5}}}
    ]);
  });

  it('matches the items watchCollections dispatches', () => {
    const entry = entryWithFiles();
    const items = {};

    const teardown = watchCollections(entry, {
      dispatch(action) {
        if (action.payload.items) {
          items[action.payload.collectionName] = action.payload.items;
        }
      }
    });

    expect(collectionsSnapshot(entry)).toEqual(items);

    teardown();
  });
});
