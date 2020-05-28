import React from 'react';
import '@testing-library/jest-dom/extend-expect'
import 'support/mediaElementStub';
import 'support/fakeBrowserFeatures';
import {getInitialPlayerState, getPlayerActions} from 'support/fakePlayerState';

import {renderInEntry} from "../support";
import {AudioPlayer} from 'frontend/AudioPlayer';
import {media} from 'pageflow/frontend';

describe('AudioPlayer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  let getAudioSeed = ()=>{
    return {
      fileUrlTemplates: {
        audioFiles: {
          mp3: ':id_partition/audio.mp3'
        }
      },
      audioFiles: [
        {id: 1, permaId: 100, isReady: true}
      ]
    };
  }
  it('renders audio with provided file id', () => {
    let state = getInitialPlayerState();
    let actions = getPlayerActions();
    const result =
      renderInEntry(<AudioPlayer id={100} playerState={state} playerActions={actions} />, {
        seed: getAudioSeed()
      });
    expect(result.container.querySelector('audio')).toBeDefined();
  });

  it('passes correct mp3 source to media API', () => {
    let state = getInitialPlayerState();
    let actions = getPlayerActions();
    const spyMedia = jest.spyOn(media, 'getPlayer')
    renderInEntry(<AudioPlayer id={100} playerState={state} playerActions={actions} />, {
      seed: getAudioSeed()
    });
    expect(spyMedia).toHaveBeenCalledWith(
      expect.objectContaining([{ type: 'audio/mp3', src: '000/000/001/audio.mp3?u=1'} ]),
      expect.anything()
    );
  });

  it('passes correct mp3 and m4a source to media API', () => {
    let state = getInitialPlayerState();
    let actions = getPlayerActions();
    const spyMedia = jest.spyOn(media, 'getPlayer')
    let audioSeed = getAudioSeed();
    audioSeed.fileUrlTemplates.audioFiles['m4a'] = ':id_partition/audio.m4a'
    renderInEntry(<AudioPlayer id={100} playerState={state} playerActions={actions} />, {
      seed: audioSeed
    });
    expect(spyMedia).toHaveBeenCalledWith(
      expect.objectContaining([ 
        { type: 'audio/mp3', src: '000/000/001/audio.mp3?u=1'},
        { type: 'audio/m4a', src: '000/000/001/audio.m4a?u=1'} ]),
      expect.anything()
    );
  });
  
  it('passes correct mp3, m4a and ogg sources to media API', () => {
    let state = getInitialPlayerState();
    let actions = getPlayerActions();
    const spyMedia = jest.spyOn(media, 'getPlayer')
    let audioSeed = getAudioSeed();
    audioSeed.fileUrlTemplates.audioFiles['m4a'] = ':id_partition/audio.m4a'
    audioSeed.fileUrlTemplates.audioFiles['ogg'] = ':id_partition/audio.ogg'
    renderInEntry(<AudioPlayer id={100} playerState={state} playerActions={actions} />, {
      seed: audioSeed
    });
    expect(spyMedia).toHaveBeenCalledWith(
      expect.objectContaining([ 
        { type: 'audio/ogg', src: '000/000/001/audio.ogg?u=1'},
        { type: 'audio/mp3', src: '000/000/001/audio.mp3?u=1'},
        { type: 'audio/m4a', src: '000/000/001/audio.m4a?u=1'}
      ]),
      expect.anything()
    );
  });

  it('sources other than  mp3, m4a and ogg are not passed to media API', () => {
    let state = getInitialPlayerState();
    let actions = getPlayerActions();
    const spyMedia = jest.spyOn(media, 'getPlayer')
    let audioSeed = getAudioSeed();
    audioSeed.fileUrlTemplates.audioFiles['m4a'] = ':id_partition/audio.m4a'
    audioSeed.fileUrlTemplates.audioFiles['ogg'] = ':id_partition/audio.ogg'
    audioSeed.fileUrlTemplates.audioFiles['avi'] = ':id_partition/audio.avi'
    
    renderInEntry(<AudioPlayer id={100} playerState={state} playerActions={actions} />, {
      seed: audioSeed
    });
    expect(spyMedia).toHaveBeenCalledWith(
      expect.not.objectContaining([ 
        { type: 'audio/avi', src: '000/000/001/audio.avi?u=1'}
      ]),
      expect.anything()
    );
  });

  it('without sources no media player is requested', () => {
    const spyMedia = jest.spyOn(media, 'getPlayer');
    renderInEntry(<AudioPlayer />);
    expect(spyMedia).not.toHaveBeenCalled();
  });
  

});
