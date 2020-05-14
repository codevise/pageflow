import React from 'react';
import '@testing-library/jest-dom/extend-expect'
import 'support/mediaElementStub';
import {render} from '@testing-library/react'
import {media, browser} from 'pageflow/frontend';
import {MediaPlayer} from 'frontend/MediaPlayer';

browser.detectFeatures();

describe('MediaPlayer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  let getAudioSources = () => {
    return [ 
      {type: 'audio/ogg', src: 'http://example.com/example.ogg'},
      {type: 'audio/m4a', src: 'http://example.com/example.m4a'},
      {type: 'audio/mp3', src: 'http://example.com/example.ogg'}
    ];
  }
  let getVideoSources = () => {
    return [ 
      {type: 'video/mp4', src: 'http://example.com/example.mp4'},
    ];
  }

  it('do not renders audio tag without sources', () => {
    const {container} = render(<MediaPlayer type={'audio'} />);
    expect(container.querySelector('audio')).toBeNull();
  });

  it('renders audio tag for audio type sources', () => {
    const {container} = render(<MediaPlayer type={'audio'} sources={getAudioSources()} />);
    
    expect(container.querySelector('audio')).toBeDefined();
  });

  it('renders video tag for video type sources', () => {
    const {container} = render(<MediaPlayer type={'video'} sources={getAudioSources()} />);
    
    expect(container.querySelector('video')).toBeDefined();
  });

  it('do not requests new Player for same sources', () => {
    const spyMedia = jest.spyOn(media, 'getPlayer');
    const {rerender} = render(<MediaPlayer type={'video'} sources={getVideoSources()} />);
    expect(spyMedia).toHaveBeenCalledTimes(1);
    rerender(<MediaPlayer type={'video'} sources={getVideoSources()} />);
    expect(spyMedia).toHaveBeenCalledTimes(1);
  });

  it('requests new Player on sources change', () => {
    const spyMedia = jest.spyOn(media, 'getPlayer');
    const {rerender} = render(<MediaPlayer type={'video'} sources={getVideoSources()} />);
    expect(spyMedia).toHaveBeenCalledTimes(1);
    let videoSources = getVideoSources();
    videoSources[0].src = 'example.mp4';
    rerender(<MediaPlayer type={'video'} sources={videoSources} />);
    expect(spyMedia).toHaveBeenCalledTimes(2);
  });

  it('releases media player on component unmount', () => {
    const {container, unmount} = render(<MediaPlayer type={'audio'} sources={getAudioSources()} />);
    const spyMediaRelease = jest.spyOn(media, 'releasePlayer');
    unmount();
    expect(spyMediaRelease).toHaveBeenCalled();
    expect(container.querySelector('audio')).toBeNull();
  });

});
