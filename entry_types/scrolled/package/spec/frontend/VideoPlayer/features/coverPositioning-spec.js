import React from 'react';
import '@testing-library/jest-dom/extend-expect'
import 'support/mediaElementStub';
import {getInitialPlayerState, getPlayerActions} from 'support/fakePlayerState';

import {renderInEntry} from 'support';
import {useBackgroundFile} from 'frontend/useBackgroundFile';
import {useFile} from 'entryState';
import {VideoPlayer} from 'frontend/VideoPlayer';

describe('VideoPlayer cover positioning', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  function getVideoFileSeed({
    id = 1,
    permaId = 100,
    basename = 'video',
    configuration = {}
  } = {}) {
    return {
      fileUrlTemplates: {
        videoFiles: {
          medium: ':id_partition/medium/:basename.mp4',
          high: ':id_partition/high/:basename.mp4',
          'hls-playlist': ':id_partition/hls-playlist.m3u8',
          'hls-playlist-high-and-up': ':id_partition/hls-playlist-high-and-up.m3u8'
        }
      },
      videoFiles: [
        {id, permaId, isReady: true, basename, configuration}
      ]
    };
  }

  function requiredProps() {
    return {
      playerState: getInitialPlayerState(),
      playerActions: getPlayerActions()
    };
  }

  it('sets object position based on motif area to media api when fit is cover', () => {
    const result = renderInEntry(
      () => {
        const file = useBackgroundFile({
          file: useFile({collectionName: 'videoFiles', permaId: 100}),
          motifArea: {left: 50, top: 0, width: 50, height: 40},
          containerDimension: {width: 1000, height: 1000}
        });

        return (
          <VideoPlayer {...requiredProps()}
                       videoFile={file}
                       fit="cover" />
        );
      },
      {
        seed: getVideoFileSeed({
          permaId: 100, width: 2000, height: 1000
        })
      }
    );

    expect(result.container.querySelector('video')).toHaveStyle('object-position: 100% 50%');
  });

  it('does not set object position when fit is not cover', () => {
    const result = renderInEntry(
      () => {
        const file = useBackgroundFile({
          file: useFile({collectionName: 'videoFiles', permaId: 100}),
          motifArea: {left: 50, top: 0, width: 50, height: 40},
          containerDimension: {width: 1000, height: 1000}
        });

        return (
          <VideoPlayer {...requiredProps()}
                       videoFile={file} />
        );
      },
      {
        seed: getVideoFileSeed({
          permaId: 100, width: 2000, height: 1000
        })
      }
    );

    expect(result.container.querySelector('video')).toHaveAttribute('style', '');
  });
});
