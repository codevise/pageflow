import React from 'react';
import '@testing-library/jest-dom/extend-expect'
import 'support/mediaElementStub';

import {renderInEntry} from "../support";
import {VideoPlayer} from 'frontend/VideoPlayer';
import {media, browser} from 'pageflow/frontend';

describe('VideoPlayer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  let getVideoSeed = ()=>{
    return {
      fileUrlTemplates: {
        videoFiles: {
          high: ':id_partition/video.mp4'
        }
      },
      videoFiles: [
        {id: 1, permaId: 100, isReady: true}
      ]
    };
  }
  it('renders video with provided file id', () => {
    return browser.detectFeatures().then(()=>{
      const result =
        renderInEntry(<VideoPlayer id={100} />, {
          seed: getVideoSeed()
        });
      expect(result.container.querySelector('video')).toBeDefined();
    });
  });

  it('passes correct sources to media API', () => {
    const spyMedia = jest.spyOn(media, 'getPlayer');
    renderInEntry(<VideoPlayer id={100} />, {
      seed: getVideoSeed()
    });
    expect(spyMedia).toHaveBeenCalledWith(
      expect.objectContaining([ { type: 'video/mp4', src: '000/000/001/video.mp4?u=1' } ]),
      expect.anything()
    );
  });

  it('does not accept any source other than "high" ', () => {
    const spyMedia = jest.spyOn(media, 'getPlayer');
    let videoSeed = getVideoSeed();
    videoSeed.fileUrlTemplates.videoFiles['mp3'] = '000/000/001/video.mp3?u=1'
    renderInEntry(<VideoPlayer id={100} />, {
      seed: videoSeed
    });
    expect(spyMedia).toHaveBeenCalledWith(
      expect.not.objectContaining([ { type: 'video/mp3', src: '000/000/001/video.mp3?u=1' } ]),
      expect.anything()
    );
  });
  
  it('without sources no media player is request', () => {
    const spyMedia = jest.spyOn(media, 'getPlayer');
    renderInEntry(<VideoPlayer />);
    expect(spyMedia).not.toHaveBeenCalled();
  });

});
