import {ExternalLink} from 'contentElements/externalLinkList/frontend/ExternalLink';

import React from 'react';

import {renderInEntry} from 'support';
import '@testing-library/jest-dom/extend-expect';

describe('ExternalLink', () => {
  it('does not render url without protocol', () => {
    const {getByRole} = renderInEntry(<ExternalLink url="example.com" />)

    expect(getByRole('link')).toHaveAttribute('href', 'http://example.com');
  });

  it('preserves http url protocol', () => {
    const {getByRole} = renderInEntry(<ExternalLink url="http://example.com" />)

    expect(getByRole('link')).toHaveAttribute('href', 'http://example.com');
  });

  it('preserves protocol relative urls', () => {
    const {getByRole} = renderInEntry(<ExternalLink url="//example.com" />)

    expect(getByRole('link')).toHaveAttribute('href', '//example.com');
  });

  it('preserves https url protocol', () => {
    const {getByRole} = renderInEntry(<ExternalLink url="https://example.com" />)

    expect(getByRole('link')).toHaveAttribute('href', 'https://example.com');
  });

  it('renders linkThumbnailLarge image by default', () => {
    const {getByRole} = renderInEntry(
      <ExternalLink url=""
                    loadImages={true}
                    thumbnail={5} />,
      {
        seed: {
          imageFiles: [{permaId: 5}],
          imageFileUrlTemplates: {
            linkThumbnailLarge: ':id_partition/linkThumbnailLarge/image.jpg'
          },
        }
      }
    )

    expect(getByRole('img')).toHaveAttribute('src', expect.stringContaining('linkThumbnailLarge'));
    expect(getByRole('img').parentNode).not.toHaveAttribute('style');
  });

  it('uses medium image as thumbnail with alternative aspect ratio', () => {
    const {getByRole} = renderInEntry(
      <ExternalLink url=""
                    loadImages={true}
                    thumbnail={5}
                    thumbnailAspectRatio="square" />,
      {
        seed: {
          imageFiles: [{permaId: 5}],
          imageFileUrlTemplates: {
            linkThumbnailLarge: ':id_partition/linkThumbnailLarge/image.jpg',
            medium: ':id_partition/medium/image.jpg'
          },
        }
      }
    )

    expect(getByRole('img')).toHaveAttribute('src', expect.stringContaining('medium'));
    expect(getByRole('img').parentNode).toHaveStyle('paddingTop: 100%');
  });

  it('uses medium image as thumbnail with alternative crop position', () => {
    const {getByRole} = renderInEntry(
      <ExternalLink url=""
                    loadImages={true}
                    thumbnail={5}
                    thumbnailCropPosition={{x: 100, y: 20}} />,
      {
        seed: {
          imageFiles: [{permaId: 5}],
          imageFileUrlTemplates: {
            linkThumbnailLarge: ':id_partition/linkThumbnailLarge/image.jpg',
            medium: ':id_partition/medium/image.jpg'
          },
        }
      }
    )

    expect(getByRole('img')).toHaveAttribute('src', expect.stringContaining('medium'));
    expect(getByRole('img')).toHaveStyle('object-position: 100% 20%');
  });

  it('uses medium image as thumbnail with original aspect ratio', () => {
    const {getByRole} = renderInEntry(
      <ExternalLink url=""
                    loadImages={true}
                    thumbnail={5}
                    thumbnailAspectRatio="original" />,
      {
        seed: {
          imageFiles: [{permaId: 5, width: 1000, height: 500}],
          imageFileUrlTemplates: {
            linkThumbnailLarge: ':id_partition/linkThumbnailLarge/image.jpg',
            medium: ':id_partition/medium/image.jpg'
          },
        }
      }
    )

    expect(getByRole('img')).toHaveAttribute('src', expect.stringContaining('medium'));
    expect(getByRole('img').parentNode).toHaveStyle('paddingTop: 50%');
  });
});
