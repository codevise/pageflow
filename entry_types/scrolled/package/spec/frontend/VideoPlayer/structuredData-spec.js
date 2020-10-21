import React from 'react';

import {renderInEntry} from 'support';
import {getInitialPlayerState, getPlayerActions} from 'support/fakePlayerState';
import {useFakeMedia} from 'support/fakeMedia';
import * as jsonLdQueries from 'support/jsonLdQueries';

import {useFile} from 'entryState';
import {VideoPlayer} from 'frontend/VideoPlayer';

describe('VideoPlayer structured data', () => {
  useFakeMedia();

  it('is rendered by default', () => {
    const {getJsonLd} = renderInEntry(
      () => <VideoPlayer videoFile={useFile({collectionName: 'videoFiles', permaId: 100})}
                         playerState={getInitialPlayerState()}
                         playerActions={getPlayerActions()} />,
      {
        seed: {
          fileUrlTemplates: {
            videoFiles: {
              posterMedium: '//cdn/:id_partition/posterMedium.jpg',
              high: '//cdn/:id_partition/high/:basename.mp4'
            }
          },
          entry: {
            publishedAt: '2020-08-10',
          },
          videoFiles: [
            {
              id: 1,
              permaId: 100,
              createdAt: '2020-08-01',
              isReady: true,
              basename: 'video',
              width: 1080,
              height: 960,
              durationInMs: (3 * 60 + 43) * 1000 + 120,
              rights: 'some author',
              configuration: {alt: 'alt text'}
            }
          ]
        },
        queries: jsonLdQueries
      });

    expect(getJsonLd()).toMatchObject({
      '@context': 'http://schema.org',
      '@type': 'VideoObject',
      name: 'video',
      description: 'alt text',
      url: 'https://cdn/000/000/001/high/video.mp4',
      thumbnailUrl: 'https://cdn/000/000/001/posterMedium.jpg',
      width: 1080,
      height: 960,
      duration: 'PT3M43S',
      datePublished: '2020-08-10',
      uploadDate: '2020-08-01',
      copyrightHolder: {
        '@type': 'Organization',
        name: 'some author'
      }
    });
  });
});
