import React from 'react';

import {renderInEntry} from 'support';
import {getInitialPlayerState, getPlayerActions} from 'support/fakePlayerState';
import {useFakeMedia} from 'support/fakeMedia';
import * as jsonLdQueries from 'support/jsonLdQueries';

import {AudioPlayer} from 'frontend/AudioPlayer';

describe('AudioPlayer structured data', () => {
  useFakeMedia();

  function requiredProps() {
    return {
      playerState: getInitialPlayerState(),
      playerActions: getPlayerActions()
    };
  }

  it('is rendered by default', () => {
    const {getJsonLd} =
      renderInEntry(<AudioPlayer {...requiredProps()} id={100} />, {
        seed: {
          fileUrlTemplates: {
            audioFiles: {
              mp3: '//cdn/:id_partition/:basename.mp3'
            }
          },
          entry: {
            publishedAt: '2020-08-10',
          },
          audioFiles: [
            {
              id: 1,
              permaId: 100,
              createdAt: '2020-08-01',
              isReady: true,
              basename: 'audio',
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
      '@type': 'AudioObject',
      name: 'audio',
      description: 'alt text',
      url: 'https://cdn/000/000/001/audio.mp3',
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
