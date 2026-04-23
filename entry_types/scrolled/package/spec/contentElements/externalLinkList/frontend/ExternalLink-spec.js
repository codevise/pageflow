import {ExternalLink} from 'contentElements/externalLinkList/frontend/ExternalLink';

import React from 'react';

import {renderInEntry} from 'support';
import {screen} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import {features} from 'pageflow/frontend';

describe('ExternalLink', () => {
  it('renders link with href', () => {
    const configuration = {
      itemLinks: {
        1: {href: 'http://example.com'}
      }
    };

    renderInEntry(
      <ExternalLink id={1}
                    configuration={configuration} />
    );

    expect(screen.getByRole('link')).toHaveAttribute('href', 'http://example.com');
    expect(screen.getByRole('link')).not.toHaveAttribute('target');
  });

  it('supports target blank', () => {
    const configuration = {
      itemLinks: {
        1: {
          href: 'http://example.com',
          openInNewTab: true
        }
      }
    };

    renderInEntry(
      <ExternalLink id={1}
                    configuration={configuration} />
    );

    expect(screen.getByRole('link')).toHaveAttribute('href', 'http://example.com');
    expect(screen.getByRole('link')).toHaveAttribute('target', '_blank');
  });

  describe('legacy url property', () => {
    it('does not render url without protocol', () => {
      const {getByRole} = renderInEntry(
        <ExternalLink configuration={{}}
                      url="example.com" />
      );

      expect(getByRole('link')).toHaveAttribute('href', 'http://example.com');
    });

    it('preserves http url protocol', () => {
      const {getByRole} = renderInEntry(
        <ExternalLink configuration={{}}
                      url="http://example.com" />
      );

      expect(getByRole('link')).toHaveAttribute('href', 'http://example.com');
    });

    it('preserves protocol relative urls', () => {
      const {getByRole} = renderInEntry(
        <ExternalLink configuration={{}}
                      url="//example.com" />
      );

      expect(getByRole('link')).toHaveAttribute('href', '//example.com');
    });

    it('preserves https url protocol', () => {
      const {getByRole} = renderInEntry(
        <ExternalLink  configuration={{}}
                       url="https://example.com" />
      );

      expect(getByRole('link')).toHaveAttribute('href', 'https://example.com');
    });

    it('does not use target blank by default', () => {
      const {getByRole} = renderInEntry(
        <ExternalLink  configuration={{}}
                       url="https://example.com" />
      );

      expect(getByRole('link')).not.toHaveAttribute('target', '_blank');
    });

    it('supports target blank', () => {
      const {getByRole} = renderInEntry(
        <ExternalLink  configuration={{}}
                       open_in_new_tab={true}
                       url="https://example.com" />
      );

      expect(getByRole('link')).toHaveAttribute('target', '_blank');
    });
  });

  it('render texts', () => {
    const configuration = {
      itemTexts: {
        1: {
          tagline: value('Tagline'),
          title: value('Title'),
          description: value('Description'),
        }
      }
    };

    renderInEntry(
      <ExternalLink id={1}
                    configuration={configuration} />
    );

    expect(screen.getByText('Tagline')).toBeInTheDocument();
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
  });

  it('falls back to legacy texts', () => {
    renderInEntry(
      <ExternalLink id={1}
                    title="Title"
                    description="Description"
                    configuration={{}} />
    );

    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
  });

  it('prefers texts over legacy texts', () => {
    const configuration = {
      itemTexts: {
        1: {
          title: value('Title'),
          description: value('Description'),
        }
      }
    };

    renderInEntry(
      <ExternalLink id={1}
                    title="Legacy title"
                    description="Legacy description"
                    configuration={configuration} />
    );

    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
  });

  it('renders linkThumbnailLarge image by default', () => {
    const {getByRole} = renderInEntry(
      <ExternalLink configuration={{}}
                    url=""
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
      <ExternalLink configuration={{}}
                    url=""
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
  });

  it('uses medium image as thumbnail with alternative crop position', () => {
    const {getByRole} = renderInEntry(
      <ExternalLink configuration={{}}
                    url=""
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
      <ExternalLink configuration={{}}
                    url=""
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
  });

  it('falls back to linkThumbnailLarge for large linkWidth when image_srcset disabled', () => {
    const {getByRole} = renderInEntry(
      <ExternalLink configuration={{}}
                    url=""
                    loadImages={true}
                    thumbnail={5}
                    linkWidth="xxl" />,
      {
        seed: {
          imageFiles: [{permaId: 5}],
          imageFileUrlTemplates: {
            linkThumbnailLarge: ':id_partition/linkThumbnailLarge/image.jpg',
            medium: ':id_partition/medium/image.jpg',
            large: ':id_partition/large/image.jpg'
          },
        }
      }
    )

    expect(getByRole('img')).toHaveAttribute('src', expect.stringContaining('linkThumbnailLarge'));
    expect(getByRole('img')).not.toHaveAttribute('srcset');
  });

  it('uses medium image as thumbnail with thumbnail fit contain', () => {
    const {getByRole} = renderInEntry(
      <ExternalLink configuration={{}}
                    url=""
                    loadImages={true}
                    thumbnail={5}
                    thumbnailFit="contain" />,
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
  });

  describe('srcset', () => {
    beforeEach(() => features.enable('frontend', ['image_srcset']));
    afterEach(() => features.enabledFeatureNames = []);

    it('uses medium and large srcset for linkWidth m', () => {
      const {getByRole} = renderInEntry(
        <ExternalLink configuration={{}}
                      url=""
                      loadImages={true}
                      thumbnail={5}
                      linkWidth="m" />,
        {
          seed: {
            imageFiles: [{permaId: 5, id: 1, width: 4000, height: 3000}],
            imageFileUrlTemplates: {
              linkThumbnailLarge: ':id_partition/linkThumbnailLarge/image.jpg',
              medium: ':id_partition/medium/image.jpg',
              large: ':id_partition/large/image.jpg'
            },
          }
        }
      )

      expect(getByRole('img')).toHaveAttribute('srcset',
        '000/000/001/medium/image.jpg 1024w, 000/000/001/large/image.jpg 1920w');
      expect(getByRole('img')).toHaveAttribute('sizes',
        '(min-width: 950px) 50vw, 100vw');
    });

    it('uses medium, large and ultra srcset for linkWidth xxl', () => {
      const {getByRole} = renderInEntry(
        <ExternalLink configuration={{}}
                      url=""
                      loadImages={true}
                      thumbnail={5}
                      linkWidth="xxl" />,
        {
          seed: {
            imageFiles: [{permaId: 5, id: 1, width: 4000, height: 3000}],
            imageFileUrlTemplates: {
              linkThumbnailLarge: ':id_partition/linkThumbnailLarge/image.jpg',
              medium: ':id_partition/medium/image.jpg',
              large: ':id_partition/large/image.jpg',
              ultra: ':id_partition/ultra/image.jpg'
            },
          }
        }
      )

      expect(getByRole('img')).toHaveAttribute('srcset',
        '000/000/001/medium/image.jpg 1024w, ' +
        '000/000/001/large/image.jpg 1920w, ' +
        '000/000/001/ultra/image.jpg 3840w');
      expect(getByRole('img')).toHaveAttribute('sizes', '100vw');
    });

    it('still uses linkThumbnailLarge for small linkWidth', () => {
      const {getByRole} = renderInEntry(
        <ExternalLink configuration={{}}
                      url=""
                      loadImages={true}
                      thumbnail={5}
                      linkWidth="s" />,
        {
          seed: {
            imageFiles: [{permaId: 5, id: 1, width: 4000, height: 3000}],
            imageFileUrlTemplates: {
              linkThumbnailLarge: ':id_partition/linkThumbnailLarge/image.jpg',
              medium: ':id_partition/medium/image.jpg',
              large: ':id_partition/large/image.jpg'
            },
          }
        }
      )

      expect(getByRole('img')).toHaveAttribute('src', expect.stringContaining('linkThumbnailLarge'));
      expect(getByRole('img')).not.toHaveAttribute('srcset');
    });
  });
});

function value(text) {
  return [{
    type: 'paragraph',
    children: [{text}],
  }];
}
