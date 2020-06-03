import React from 'react';
import '@testing-library/jest-dom/extend-expect'
import 'support/mediaElementStub';
import 'support/fakeBrowserFeatures';
import {getInitialPlayerState, getPlayerActions} from 'support/fakePlayerState';

import {renderInEntry} from "../support";
import {VideoPlayer} from 'frontend/VideoPlayer';
import {media} from 'pageflow/frontend';

describe('VideoPlayer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  function getVideoFileSeed({
    id = 1,
    permaId = 100,
    basename = 'video'
  } = {}) {
    return {
      fileUrlTemplates: {
        videoFiles: {
          high: ':id_partition/:basename.mp4'
        }
      },
      videoFiles: [
        {id, permaId, isReady: true, basename}
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
    const result =
      renderInEntry(<VideoPlayer {...requiredProps()} id={100} />, {
        seed: getVideoFileSeed({permaId: 100})
      });

    expect(result.container.querySelector('video')).toBeDefined();
  });

  it('passes correct sources to media API', () => {
    const spyMedia = jest.spyOn(media, 'getPlayer');

    renderInEntry(<VideoPlayer {...requiredProps()} id={100} />, {
      seed: getVideoFileSeed({
        basename: 'video',
        id: 1,
        permaId: 100
      })
    });

    expect(spyMedia).toHaveBeenCalledWith(
      [{type: 'video/mp4', src: '000/000/001/video.mp4?u=1'}],
      expect.anything()
    );
  });

  it('without id no media player is request', () => {
    const spyMedia = jest.spyOn(media, 'getPlayer');
    renderInEntry(<VideoPlayer {...requiredProps()} />);
    expect(spyMedia).not.toHaveBeenCalled();
  });
});
