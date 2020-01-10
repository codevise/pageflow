import {useFile, watchCollections} from 'entryState';

import {
  ChaptersCollection,
  SectionsCollection,
  ContentElementsCollection
} from 'editor/collections';

import {renderHookInEntry} from 'support';

describe('useFile', () => {
  it('reads data from seed', () => {
    const {result} = renderHookInEntry(
      () => useFile({collectionName: 'imageFiles', permaId: 1}),
      {
        seed: {
          fileUrlTemplates: {
            imageFiles: {
              high: '/image_files/:id_partition/high.jpg'
            }
          },
          imageFiles: [
            {
              id: 100,
              permaId: 1,
              basename: 'image',
              rights: 'author',
              configuration: {
                some: 'value'
              }
            }
          ]
        }
      }
    );

    const file = result.current;

    expect(file).toMatchObject({
      id: 100,
      permaId: 1,
      configuration: {
        some: 'value'
      },
      urls: {
        high: '/image_files/000/000/100/high.jpg'
      }
    });
  });

  it('reads data from watched collection', () => {
    const {result} = renderHookInEntry(
      () => useFile({collectionName: 'imageFiles', permaId: 1}),
      {
        seed: {
          fileUrlTemplates: {
            imageFiles: {
              high: '/image_files/:id_partition/high.jpg'
            }
          }
        },
        setup: dispatch => {
          watchCollections({
            chapters: new ChaptersCollection(),
            sections: new SectionsCollection(),
            contentElements: new ContentElementsCollection(),
            files: {
              image_files: new SectionsCollection([
                {
                  id: 100,
                  perma_id: 1,
                  basename: 'image',
                  rights: 'author',
                  configuration: {
                    some: 'value'
                  }
                }
              ])
            }
          }, {dispatch})
        }
      }
    );

    const file = result.current;

    expect(file).toMatchObject({
      id: 100,
      permaId: 1,
      configuration: {
        some: 'value'
      },
      urls: {
        high: '/image_files/000/000/100/high.jpg'
      }
    });
  });
});
