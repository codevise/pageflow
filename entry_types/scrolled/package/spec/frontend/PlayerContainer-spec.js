import React from 'react';
import '@testing-library/jest-dom/extend-expect'
import 'support/mediaElementStub';

import {render} from '@testing-library/react'
import {media} from 'pageflow/frontend';
import PlayerContainer from 'frontend/MediaPlayer/PlayerContainer';
import videojs from 'videojs';

describe('PlayerContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  let getVideoSources = () => {
    return [
      {type: 'video/mp4', src: 'http://example.com/example.mp4'},
    ];
  }

  it('renders empty div when no sources are provided', () => {
    const {container} = render(<PlayerContainer />);
    expect(container.querySelector('div').childElementCount).toBe(0);
  });

  it('renders video tag of media player in a div when sources are provided', () => {
    const spyMedia = jest.spyOn(media, 'getPlayer');
    let sources = getVideoSources();
    const {container} = render(<PlayerContainer type={'video'} sources={sources} />);

    expect(spyMedia).toHaveBeenCalledWith(
      expect.objectContaining(sources),
      expect.anything()
    );
    expect(container.querySelector('div').querySelector('video')).toBeDefined();
  });

  it('calls onSetup with the media player', () => {
    let onSetup = (player) => {
      expect(Object.keys(videojs.players)).toContain(player.id());
    }
    render(<PlayerContainer type={'video'} onSetup={onSetup} sources={getVideoSources()} />);
  });

  it('calls onDispose on player unmount', () => {
    let onDispose = jest.fn();
    let {unmount} = render(<PlayerContainer type={'video'} onDispose={onDispose} sources={getVideoSources()} />);
    expect(onDispose).not.toHaveBeenCalled();
    unmount();
    expect(onDispose).toHaveBeenCalledTimes(1);
  });

  it('calls media.getPlayer with new sources, when sources are changed', () => {
    const spyMedia = jest.spyOn(media, 'getPlayer');
    let sources = getVideoSources();
    const {rerender} = render(<PlayerContainer type={'video'} sources={sources} />);

    expect(spyMedia).toHaveBeenCalledWith(
      expect.objectContaining(sources),
      expect.anything()
    );

    let newSources = getVideoSources();
    newSources[0].src = 'example.mp4';
    rerender(<PlayerContainer type={'video'} sources={newSources} />);

    expect(spyMedia).toHaveBeenCalledWith(
      expect.not.objectContaining(sources) && expect.objectContaining(newSources),
      expect.anything()
    );
  });

  it('calls media.getPlayer again, when props are changed', () => {
    const spyMedia = jest.spyOn(media, 'getPlayer');
    let sources = getVideoSources();
    const {rerender} = render(<PlayerContainer type={'video'} sources={sources} />);
    expect(spyMedia).toHaveBeenCalledTimes(1);

    rerender(<PlayerContainer type={'video'} sources={sources} loop={true} />);
    expect(spyMedia).toHaveBeenCalledTimes(2);
    expect(spyMedia).toHaveBeenCalledWith(
      expect.objectContaining(sources),
      expect.objectContaining({loop: true})
    );

    rerender(<PlayerContainer type={'video'} sources={sources} loop={true} controls={true} />);
    expect(spyMedia).toHaveBeenCalledTimes(3);
    expect(spyMedia).toHaveBeenCalledWith(
      expect.objectContaining(sources),
      expect.objectContaining({loop: true, controls: true})
    );

    rerender(<PlayerContainer type={'video'} sources={sources} loop={true} controls={true} playsInline={true} />);
    expect(spyMedia).toHaveBeenCalledTimes(4);
    expect(spyMedia).toHaveBeenCalledWith(
      expect.objectContaining(sources),
      expect.objectContaining({loop: true, controls: true, playsInline: true})
    );

    rerender(<PlayerContainer type={'audio'} sources={sources} loop={true} controls={true} playsInline={true} poster={'1'} />);
    expect(spyMedia).toHaveBeenCalledTimes(5);
    expect(spyMedia).toHaveBeenCalledWith(
      expect.objectContaining(sources),
      expect.objectContaining({tagName: 'audio', loop: true, controls: true, playsInline: true, poster: '1'})
    );
  });

});
