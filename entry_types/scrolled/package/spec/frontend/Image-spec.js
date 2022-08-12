import React from 'react';
import '@testing-library/jest-dom/extend-expect'

import {renderInEntry} from 'support';
import * as jsonLdQueries from 'support/jsonLdQueries';

import {Image} from 'frontend/Image';
import {useBackgroundFile} from 'frontend/useBackgroundFile';
import {useFile} from 'entryState';

describe('Image', () => {
  it('renders nothing by default', () => {
    const {queryByRole} =
      renderInEntry(() => <Image imageFile={useFile({collectionName: 'imageFiles', permaId: 100})} />, {
        seed: {}
      });

    expect(queryByRole('img')).toBeNull();
  });

  it('uses large variant of image given by id', () => {
    const {getByRole} =
      renderInEntry(() => <Image imageFile={useFile({collectionName: 'imageFiles', permaId: 100})} />, {
        seed: {
          imageFileUrlTemplates: {
            large: ':id_partition/image.jpg'
          },
          imageFiles: [
            {id: 1, permaId: 100}
          ]
        }
      });

    expect(getByRole('img')).toHaveAttribute('src', '000/000/001/image.jpg');
  });

  it('supports custom variant of image given by id as background', () => {
    const {getByRole} = renderInEntry(
      () => <Image imageFile={useFile({collectionName: 'imageFiles', permaId: 100})}
                   variant="medium" />,
      {
        seed: {
          imageFileUrlTemplates: {
            medium: ':id_partition/medium/image.jpg',
            large: ':id_partition/large/image.jpg'
          },
          imageFiles: [
            {id: 1, permaId: 100}
          ]
        }
      }
    );

    expect(getByRole('img')).toHaveAttribute('src', '000/000/001/medium/image.jpg');
  });

  it('does not render image if load is false', () => {
    const {queryByRole} = renderInEntry(
      () => <Image imageFile={useFile({collectionName: 'imageFiles', permaId: 100})}
                   load={false} />,
      {
        seed: {
          imageFiles: [
            {id: 1, permaId: 100}
          ]
        }
      }
    );

    expect(queryByRole('img')).toBeNull();
  });

  it('does not render image if image is not ready', () => {
    const {queryByRole} =
      renderInEntry(() => <Image imageFile={useFile({collectionName: 'imageFiles', permaId: 100})} />, {
        seed: {
          imageFiles: [
            {id: 1, permaId: 100, isReady: false}
          ]
        }
      });

    expect(queryByRole('img')).toBeNull();
  });

  it('uses centered object position by default', () => {
    const {getByRole} =
      renderInEntry(() => <Image imageFile={useFile({collectionName: 'imageFiles', permaId: 100})} />, {
        seed: {
          imageFiles: [
            {permaId: 100}
          ]
        }
      });

    expect(getByRole('img')).toHaveStyle('object-position: 50% 50%');
  });

  it('sets object position based on motif area', () => {
    const {getByRole} = renderInEntry(
      () => {
        const file = useBackgroundFile({
          file: useFile({collectionName: 'imageFiles', permaId: 100}),
          motifArea: {left: 50, top: 0, width: 50, height: 40},
          containerDimension: {width: 1000, height: 1000}
        });

        return (
          <Image imageFile={file} />
        );
      },
      {
        seed: {
          imageFiles: [{permaId: 100, width: 2000, height: 1000}]
        }
      });

    expect(getByRole('img')).toHaveStyle('object-position: 100% 50%');
  });

  it('does not render structured data by default', () => {
    const {queryJsonLd} =
      renderInEntry(() => <Image imageFile={useFile({collectionName: 'imageFiles', permaId: 100})} />, {
        seed: {
          imageFiles: [
            {permaId: 100}
          ]
        },
        queries: jsonLdQueries
      });

    expect(queryJsonLd()).toBe(null);
  });

  it('supports rendering structured data', () => {
    const {getJsonLd} = renderInEntry(
      () => <Image imageFile={useFile({collectionName: 'imageFiles', permaId: 100})}
                   structuredData={true} />,
      {
        seed: {
          imageFileUrlTemplates: {
            large: '//cdn/images/:id_partition/large.jpg'
          },
          entry: {
            publishedAt: '2020-08-10',
          },
          imageFiles: [
            {
              id: 1,
              permaId: 100,
              basename: 'image',
              configuration: {alt: 'some alt text'},
              rights: 'some author',
              height: 200,
              width: 100,
              createdAt: '2020-08-01'
            }
          ]
        },
        queries: jsonLdQueries
      }
    );

    expect(getJsonLd()).toMatchObject({'@context': 'http://schema.org',
                                       '@type': 'ImageObject',
                                       'name': 'image',
                                       'description': 'some alt text',
                                       'url': 'https://cdn/images/000/000/001/large.jpg',
                                       'width': 100,
                                       'height': 200,
                                       'datePublished': '2020-08-10',
                                       'uploadDate': '2020-08-01',
                                       'copyrightHolder': {
                                         '@type': 'Organization',
                                         'name': 'some author'
                                       }});
  });

  it('render alt text', () => {
    const {getByRole} = renderInEntry(
      () => <Image imageFile={useFile({collectionName: 'imageFiles', permaId: 100})} />,
      {
        seed: {
          imageFileUrlTemplates: {
            large: ':id_partition/image.jpg'
          },
          imageFiles: [
            {id: 1, permaId: 100, configuration: {alt: 'water'}}
          ]
        }
      }
    );

    expect(getByRole('img')).toHaveAttribute('alt', 'water');
  });

  it('render empty alt attr', () => {
    const {getByRole} = renderInEntry(
      () => <Image imageFile={useFile({collectionName: 'imageFiles', permaId: 100})} />,
      {
        seed: {
          imageFileUrlTemplates: {
            large: ':id_partition/image.jpg'
          },
          imageFiles: [
            {id: 1, permaId: 100}
          ]
        }
      }
    );

    expect(getByRole('img').hasAttribute('alt')).toBe(true);
  });
});
