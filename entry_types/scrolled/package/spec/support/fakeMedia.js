import {media} from 'pageflow/frontend';

import BackboneEvents from 'backbone-events-standalone';
import {queryHelpers} from '@testing-library/dom';

function queryPlayer(container) {
  const el = queryHelpers.queryByAttribute('data-fake-player-file-perma-id',
                                           container,
                                           () => true);
  return el && el.fakePlayer;
}

function queryPlayerByFilePermaId(container, filePermaId) {
  const el = queryHelpers.queryByAttribute('data-fake-player-file-perma-id',
                                           container,
                                           filePermaId.toString());

  return el && el.fakePlayer;
}

function getPlayer(container) {
  const player = queryPlayer(container);

  if (!player) {
    throw queryHelpers.getElementError(
      `Unable to find player.`,
      container
    )
  }
  return player;
}

function getPlayerByFilePermaId(container, filePermaId) {
  const player = queryPlayerByFilePermaId(container, filePermaId);

  if (!player) {
    throw queryHelpers.getElementError(
      `Unable to find player for file with perma id ${filePermaId}.`,
      container
    )
  }

  return player;
}

export const fakeMediaRenderQueries = {
  queryPlayer,
  queryPlayerByFilePermaId,
  getPlayer,
  getPlayerByFilePermaId
};

export function useFakeMedia() {
  beforeEach(() => {
    jest.spyOn(media, 'getPlayer').mockImplementation((sources, {filePermaId}) =>
      createFakePlayer({filePermaId})
    );
  });

  afterEach(() => jest.restoreAllMocks());
}

function createFakePlayer({filePermaId}) {
  const el = document.createElement('div');
  el.setAttribute('data-fake-player-file-perma-id', filePermaId);

  el.fakePlayer = {
    el() {
      return el;
    },

    currentTime: jest.fn(),
    bufferedEnd: jest.fn(),
    duration: jest.fn(),
    isAudio: jest.fn(),

    ready(callback) {
      callback();
    },

    prebuffer: jest.fn().mockImplementation(() => new Promise(() => {})),

    play: mockFunctionTriggering('play'),
    playOrPlayOnLoad: mockFunctionTriggering('play'),
    playAndFadeIn: mockFunctionTriggering('play'),
    pause: mockFunctionTriggering('pause'),
    fadeOutAndPause: mockFunctionTriggering('pause'),
    muted: jest.fn(),
    changeVolumeFactor: jest.fn(),
    dispose: jest.fn(),

    ...BackboneEvents,
    one(...args) { this.once(...args); }
  };

  return el.fakePlayer;
}

function mockFunctionTriggering(event) {
  return jest.fn().mockImplementation(function() { this.trigger(event); })
}
