import React from 'react';
import 'support/mediaElementStub';
import {getInitialPlayerState, getPlayerActions} from 'support/fakePlayerState';

import {renderInEntry} from 'support';
import {useFile} from 'entryState';
import {VideoPlayer} from 'frontend/VideoPlayer';
import {media, settings} from 'pageflow/frontend';

describe('VideoPlayer media player', () => {
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

  it('passes sources according to setting to media API', () => {
    const spyMedia = jest.spyOn(media, 'getPlayer');
    settings.set('videoQuality', 'auto');

    renderInEntry(
      () => <VideoPlayer {...requiredProps()}
                         videoFile={useFile({collectionName: 'videoFiles', permaId: 100})} />,
      {
        seed: getVideoFileSeed({
          basename: 'video',
          id: 1,
          permaId: 100
        })
      }
    );

    expect(spyMedia).toHaveBeenCalledWith(
      [{type: 'application/x-mpegURL', src: '000/000/001/hls-playlist.m3u8'},
       {type: 'video/mp4', src: '000/000/001/high/video.mp4'}],
      expect.anything()
    );
  });

  it('support adaptiveMinQuality prop', () => {
    const spyMedia = jest.spyOn(media, 'getPlayer');
    settings.set('videoQuality', 'auto');

    renderInEntry(
      () => <VideoPlayer {...requiredProps()}
                         videoFile={useFile({collectionName: 'videoFiles', permaId: 100})}
                         adaptiveMinQuality="high" />,
      {
        seed: getVideoFileSeed({
          basename: 'video',
          id: 1,
          permaId: 100
        })
      }
    );

    expect(spyMedia).toHaveBeenCalledWith(
      [{type: 'application/x-mpegURL', src: '000/000/001/hls-playlist-high-and-up.m3u8'},
       {type: 'video/mp4', src: '000/000/001/high/video.mp4'}],
      expect.anything()
    );
  });

  it('uses quality from settings', () => {
    const spyMedia = jest.spyOn(media, 'getPlayer');
    settings.set('videoQuality', 'medium');

    renderInEntry(
      () => <VideoPlayer {...requiredProps()}
                         videoFile={useFile({collectionName: 'videoFiles', permaId: 100})} />,
      {
        seed: getVideoFileSeed({
          basename: 'video',
          id: 1,
          permaId: 100
        })
      }
    );

    expect(spyMedia).toHaveBeenCalledWith(
      [{type: 'video/mp4', src: '000/000/001/medium/video.mp4'}],
      expect.anything()
    );
  });

  it('passes file perma id to media api', () => {
    const spyMedia = jest.spyOn(media, 'getPlayer');

    renderInEntry(
      () => <VideoPlayer {...requiredProps()}
                         videoFile={useFile({collectionName: 'videoFiles', permaId: 100})} />,
      {
        seed: getVideoFileSeed({
          basename: 'video',
          id: 1,
          permaId: 100
        })
      }
    );

    expect(spyMedia).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({filePermaId: 100})
    );
  });

  it('passes displayName from video file as media events context data', () => {
    const spyMedia = jest.spyOn(media, 'getPlayer');

    renderInEntry(
      () => <VideoPlayer {...requiredProps()}
                         videoFile={useFile({collectionName: 'videoFiles', permaId: 100})} />,
      {
        seed: {
          fileUrlTemplates: {
            videoFiles: {
              high: ':id_partition/high/:basename.mp4'
            }
          },
          videoFiles: [
            {id: 1, permaId: 100, isReady: true, displayName: 'Interview.mp4'}
          ]
        }
      }
    );

    expect(spyMedia).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        mediaEventsContextData: expect.objectContaining({
          fileDisplayName: 'Interview.mp4'
        })
      })
    );
  });

  it('without id no media player is request', () => {
    const spyMedia = jest.spyOn(media, 'getPlayer');
    renderInEntry(<VideoPlayer {...requiredProps()} />);
    expect(spyMedia).not.toHaveBeenCalled();
  });
});
