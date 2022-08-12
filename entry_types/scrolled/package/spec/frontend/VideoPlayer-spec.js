import React from 'react';
import '@testing-library/jest-dom/extend-expect'
import 'support/mediaElementStub';
import {getInitialPlayerState, getPlayerActions} from 'support/fakePlayerState';

import {renderInEntry} from "../support";
import {useBackgroundFile} from 'frontend/useBackgroundFile';
import {useFile} from 'entryState';
import {VideoPlayer} from 'frontend/VideoPlayer';
import {media, settings} from 'pageflow/frontend';

describe('VideoPlayer', () => {
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
          high: ':id_partition/high/:basename.mp4'
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

  it('does not render video element when isPrepared is false', () => {
    const result = renderInEntry(
      () => <VideoPlayer {...requiredProps()}
                         videoFile={useFile({collectionName: 'videoFiles', permaId: 100})}
                         isPrepared={false} />,
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

  it('passes sources according to setting to media API', () => {
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

  it('without id no media player is request', () => {
    const spyMedia = jest.spyOn(media, 'getPlayer');
    renderInEntry(<VideoPlayer {...requiredProps()} />);
    expect(spyMedia).not.toHaveBeenCalled();
  });

  it('requests media player with given poster', () => {
    const spyMedia = jest.spyOn(media, 'getPlayer')

    renderInEntry(
      () => <VideoPlayer {...requiredProps()}
                         videoFile={useFile({collectionName: 'videoFiles', permaId: 100})}
                         posterImageFile={useFile({collectionName: 'imageFiles', permaId: 200})} />,
      {
        seed: {
          fileUrlTemplates: {
            videoFiles: {
              high: ':id_partition/video.mp4'
            },
            imageFiles: {
              large: ':id_partition/large.jpg'
            }
          },
          videoFiles: [
            {id: 1, permaId: 100, isReady: true}
          ],
          imageFiles: [
            {id: 2, permaId: 200, isReady: true}
          ]
        }
      }
    );

    expect(spyMedia).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        poster: '000/000/002/large.jpg'
      })
    );
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

  it('passes object position based on motif area to media api when fit is cover', () => {
    const spyMedia = jest.spyOn(media, 'getPlayer');

    renderInEntry(
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

    expect(spyMedia).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({objectPosition: {x: 100, y: 50}})
    );
  });

  it('does not pass object position when fit is not cover', () => {
    const spyMedia = jest.spyOn(media, 'getPlayer');

    renderInEntry(
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

    expect(spyMedia).toHaveBeenCalledWith(
      expect.anything(),
      expect.not.objectContaining({objectPosition: expect.anything()})
    );
  });
});
