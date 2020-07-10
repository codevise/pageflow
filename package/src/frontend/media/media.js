import {MediaPool, MediaType} from './MediaPool';
import BackboneEvents from 'backbone-events-standalone';

export const media = {
  playerPool: new MediaPool(),
  muteState: true,
  get muted(){ return this.muteState; },
  mute: function (value) {
    this.muteState = value;
    this.playerPool.blessAll(value);

    this.trigger('change:muted', value);
  },
  getPlayer: function (fileSource, options) {
    options.playerType = options.tagName || MediaType.VIDEO;
    let player = this.playerPool.allocatePlayer(options);
    if (player) {
      player.muted(this.muteState);
      player.src(fileSource);

      if (options.textTrackSources) {
        options.textTrackSources.forEach(track => player.addRemoteTextTrack(track, true));
      }

      return player;
    }
  },
  releasePlayer: function (player) {
    if (player) {
      this.playerPool.unAllocatePlayer(player);
    }
  }
};

Object.assign(media, BackboneEvents);
