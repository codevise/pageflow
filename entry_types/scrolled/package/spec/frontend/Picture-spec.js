import React from 'react';
import '@testing-library/jest-dom/extend-expect'

import {renderInEntry} from 'support';
import * as jsonLdQueries from 'support/jsonLdQueries';

import {Picture} from 'frontend/Picture';
import {useFile} from 'entryState';

describe('Picture', () => {
  it('renders nothing by default', () => {
    const {queryByRole} =
      renderInEntry(() => <Picture imageFile={useFile({collectionName: 'imageFiles',
                                                       permaId: 100})} />, {
        seed: {}
      });

    expect(queryByRole('img')).toBeNull();
  });

  it('uses large variant of image given by id', () => {
    const {getByRole} =
      renderInEntry(() => <Picture imageFile={useFile({collectionName: 'imageFiles',
                                                       permaId: 100})} />, {
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
      () => <Picture imageFile={useFile({collectionName: 'imageFiles',
                                         permaId: 100})}
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

  it('does not set loading attribute by default', () => {
    const {queryByRole} = renderInEntry(
      () => <Picture imageFile={useFile({collectionName: 'imageFiles',
                                         permaId: 100})} />,
      {
        seed: {
          imageFiles: [
            {id: 1, permaId: 100}
          ]
        }
      }
    );

    expect(queryByRole('img')).not.toHaveAttribute('loading');
  });

  it('supports setting loading attribute', () => {
    const {queryByRole} = renderInEntry(
      () => <Picture imageFile={useFile({collectionName: 'imageFiles',
                                         permaId: 100})}
                     loading="lazy" />,
      {
        seed: {
          imageFiles: [
            {id: 1, permaId: 100}
          ]
        }
      }
    );

    expect(queryByRole('img')).toHaveAttribute('loading', 'lazy');
  });

  it('does not render image if image is not ready', () => {
    const {queryByRole} =
      renderInEntry(() => <Picture imageFile={useFile({collectionName: 'imageFiles',
                                                       permaId: 100})} />, {
        seed: {
          imageFiles: [
            {id: 1, permaId: 100, isReady: false}
          ]
        }
      });

    expect(queryByRole('img')).toBeNull();
  });

  it('supports rendering different image for portrait media query', () => {
    const {container} = renderInEntry(
      () => <Picture imageFile={useFile({collectionName: 'imageFiles',
                                         permaId: 100})}
                     imageFileMobile={useFile({collectionName: 'imageFiles',
                                               permaId: 101})}/>,
      {
        seed: {
          imageFileUrlTemplates: {
            large: ':id_partition/image.jpg'
          },
          imageFiles: [
            {id: 1, permaId: 100},
            {id: 2, permaId: 101}
          ]
        }
    });

    const source = container.querySelector('source');
    expect(source).toHaveAttribute('srcset', '000/000/002/image.jpg');
    expect(source).toHaveAttribute('media', '(orientation: portrait)');
  });

  it('does not render structured data by default', () => {
    const {queryJsonLd} =
      renderInEntry(() => <Picture imageFile={useFile({collectionName: 'imageFiles',
                                                       permaId: 100})} />, {
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
      () => <Picture imageFile={useFile({collectionName: 'imageFiles',
                                         permaId: 100})}
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
      () => <Picture imageFile={useFile({collectionName: 'imageFiles', permaId: 100})} />,
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

  it('render empty alt attribute', () => {
    const {getByRole} = renderInEntry(
      () => <Picture imageFile={useFile({collectionName: 'imageFiles', permaId: 100})} />,
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

    expect(getByRole('img')).toHaveAttribute('alt', '');
  });
});
