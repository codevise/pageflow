import React from 'react';
import '@testing-library/jest-dom/extend-expect'
import 'support/mediaElementStub';
import {getInitialPlayerState, getPlayerActions} from 'support/fakePlayerState';

import {renderInEntry} from 'support';
import {useFile} from 'entryState';
import {VideoPlayer} from 'frontend/VideoPlayer';

describe('VideoPlayer rendering', () => {
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

  it('renders video with provided file id', () => {
    const result = renderInEntry(
      () => <VideoPlayer {...requiredProps()}
                         videoFile={useFile({collectionName: 'videoFiles', permaId: 100})} />,
      {seed: getVideoFileSeed({permaId: 100})}
    );

    expect(result.container.querySelector('video')).toBeDefined();
  });

  it('does not render video element when load is "none"', () => {
    const result = renderInEntry(
      () => <VideoPlayer {...requiredProps()}
                         videoFile={useFile({collectionName: 'videoFiles', permaId: 100})}
                         load="none" />,
      {seed: getVideoFileSeed()}
    );

    expect(result.container.querySelector('video')).toBeNull();
  });

  it('renders null when file is undefined and fit is cover', () => {
    const result =
      renderInEntry(<VideoPlayer {...requiredProps()} fit="cover" />,
                    {seed: getVideoFileSeed()});

    expect(result.container.querySelector('video')).toBeNull();
  });

  it('renders alt text', () => {
    const result = renderInEntry(
      () => <VideoPlayer {...requiredProps()}
                         videoFile={useFile({collectionName: 'videoFiles', permaId: 100})} />,
      {
        seed: getVideoFileSeed({permaId: 100, configuration: {alt: 'interview'}})
      }
    );

    expect(result.container.querySelector('video')).toHaveAttribute('alt', 'interview');
  });

  it('renders empty alt attr', () => {
    const result = renderInEntry(
      () => <VideoPlayer {...requiredProps()}
                         videoFile={useFile({collectionName: 'videoFiles', permaId: 100})} />,
      {
        seed: getVideoFileSeed({permaId: 100})
      });

    expect(result.container.querySelector('video').hasAttribute('alt')).toBe(true);
  });
});
