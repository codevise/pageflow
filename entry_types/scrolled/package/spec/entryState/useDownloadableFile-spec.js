import {useDownloadableFile} from 'entryState';

import {renderHookInEntry} from 'support';

describe('useDownloadableFile', () => {
  it('includes download url', () => {
    const {result} = renderHookInEntry(
      () => useDownloadableFile({collectionName: 'imageFiles', permaId: 1}),
      {
        seed: {
          fileUrlTemplates: {
            imageFiles: {
              original: '/image_files/:id_partition/original/:basename.:extension',
              large: '/image_files/:id_partition/large/:basename.:processed_extension',
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
              extension: 'svg',
              displayName: 'My Image.svg',
              processedExtension: 'webp',
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
      extension: 'svg',
      displayName: 'My Image.svg',
      configuration: {
        some: 'value'
      },
      urls: {
        download: '/image_files/000/000/100/original/image.svg?download=My%20Image.svg',
        original: '/image_files/000/000/100/original/image.svg',
        large: '/image_files/000/000/100/large/image.webp',
      }
    });
  });

  it('returns null for missing file', () => {
    const {result} = renderHookInEntry(
      () => useDownloadableFile({collectionName: 'imageFiles', permaId: 100}),
      {
        seed: {
          fileUrlTemplates: {
            imageFiles: {
              original: '/image_files/:id_partition/original/:basename.:extension',
              large: '/image_files/:id_partition/large/:basename.:processed_extension',
            }
          },
          fileModelTypes: {
            imageFiles: 'Pageflow::ImageFile'
          },
          imageFiles: []
        }
      }
    );

    const file = result.current;

    expect(file).toBeNull();
  });
});
