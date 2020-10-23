import {useFile, watchCollections} from 'entryState';

import {ScrolledEntry} from 'editor/models/ScrolledEntry';

import {factories} from 'pageflow/testHelpers';
import {renderHookInEntry} from 'support';

describe('useFile', () => {
  it('reads data from seed', () => {
    const {result} = renderHookInEntry(
      () => useFile({collectionName: 'imageFiles', permaId: 1}),
      {
        seed: {
          fileUrlTemplates: {
            imageFiles: {
              large: '/image_files/:id_partition/large.jpg'
            }
          },
          fileModelTypes: {
            imageFiles: 'Pageflow::ImageFile'
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
      modelType: 'Pageflow::ImageFile',
      configuration: {
        some: 'value'
      },
      urls: {
        large: '/image_files/000/000/100/large.jpg'
      }
    });
  });

  it('reads image file data from watched collection', () => {
    const {result} = renderHookInEntry(
      () => useFile({collectionName: 'imageFiles', permaId: 1}),
      {
        seed: {
          fileUrlTemplates: {
            imageFiles: {
              large: '/image_files/:id_partition/large.jpg'
            }
          },
          fileModelTypes: {
            imageFiles: 'Pageflow::ImageFile'
          }
        },
        setup: (dispatch, entryTypeSeed) => {
          watchCollections(factories.entry(ScrolledEntry, {}, {
            entryTypeSeed,
            fileTypes: factories.fileTypesWithImageFileType(),
            filesAttributes: {
              image_files: [
                {
                  id: 100,
                  perma_id: 1,
                  basename: 'image',
                  rights: 'author',
                  configuration: {
                    some: 'value'
                  }
                },
              ]
            }
          }), {dispatch})
        }
      }
    );

    const file = result.current;

    expect(file).toMatchObject({
      id: 100,
      permaId: 1,
      modelType: 'Pageflow::ImageFile',
      configuration: {
        some: 'value'
      },
      urls: {
        large: '/image_files/000/000/100/large.jpg'
      }
    });
  });

  it('reads video file data from watched collection', () => {
    const {result} = renderHookInEntry(
      () => useFile({collectionName: 'videoFiles', permaId: 1}),
      {
        seed: {
          fileUrlTemplates: {
            videoFiles: {
              high: '/video_files/:id_partition/high.mp4',
              posterLarge: '/video_files/:id_partition/posterLarge.jpg',
            },
          },
          fileModelTypes: {
            videoFiles: 'Pageflow::VideoFile'
          }
        },
        setup: (dispatch, entryTypeSeed) => {
          watchCollections(factories.entry(ScrolledEntry, {}, {
            entryTypeSeed,
            fileTypes: factories.fileTypes(function() {
              this.withVideoFileType();
              this.withTextTrackFileType();
            }),
            filesAttributes: {
              video_files: [
                {
                  id: 100,
                  perma_id: 1,
                  basename: 'video',
                  rights: 'author',
                  variants: ['high', 'poster_large'],
                  configuration: {
                    some: 'value'
                  }
                }
              ]
            }
          }), {dispatch})
        }
      }
    );

    const file = result.current;

    expect(file).toMatchObject({
      id: 100,
      permaId: 1,
      modelType: 'Pageflow::VideoFile',
      configuration: {
        some: 'value'
      },
      urls: {
        high: '/video_files/000/000/100/high.mp4',
        posterLarge: '/video_files/000/000/100/posterLarge.jpg'
      }
    });
  });
});
