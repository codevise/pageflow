import {watchCollections, watchFileCollections} from 'entryState';

import {useEditorGlobals} from 'support';

describe('watchCollections', () => {
  const {createEntry} = useEditorGlobals();

  it('includes referenced flags of files', () => {
    const entry = createEntry({
      imageFiles: [{id: 100, perma_id: 5}, {id: 101, perma_id: 6}],
      sections: [{id: 1, permaId: 10, configuration: {backdrop: {image: 5}}}],
      fileReferenceLocations: {
        sections: [{path: ['backdrop', 'image'], collection: 'imageFiles'}]
      }
    });
    const items = {};

    const teardown = watchCollections(entry, {
      dispatch(action) {
        if (action.payload.items) {
          items[action.payload.collectionName] = action.payload.items;
        }
      }
    });

    expect(items.imageFiles).toMatchObject([
      {permaId: 5, isReferenced: true},
      {permaId: 6, isReferenced: false}
    ]);

    teardown();
  });

  it('dispatches change when referenced flag of file changes', () => {
    const entry = createEntry({
      imageFiles: [{id: 100, perma_id: 5}],
      sections: [{id: 1, permaId: 10}],
      fileReferenceLocations: {
        sections: [{path: ['backdrop', 'image'], collection: 'imageFiles'}]
      }
    });
    const actions = [];

    const teardown = watchCollections(entry, {dispatch: action => actions.push(action)});
    entry.sections.first().configuration.set('backdrop', {image: 5});

    expect(actions).toContainEqual(expect.objectContaining({
      payload: expect.objectContaining({
        collectionName: 'imageFiles',
        attributes: expect.objectContaining({permaId: 5, isReferenced: true})
      })
    }));

    teardown();
  });
});

describe('watchFileCollections', () => {
  const {createEntry} = useEditorGlobals();

  it('dispatches file collections only', () => {
    const entry = createEntry({
      imageFiles: [{id: 100, perma_id: 5}],
      sections: [{id: 1, permaId: 10}]
    });
    const collectionNames = [];

    const teardown = watchFileCollections(entry, {
      dispatch(action) {
        if (action.payload.items) {
          collectionNames.push(action.payload.collectionName);
        }
      }
    });

    expect(collectionNames).toContain('imageFiles');
    expect(collectionNames).not.toContain('sections');
    expect(collectionNames).not.toContain('contentElements');

    teardown();
  });
});
