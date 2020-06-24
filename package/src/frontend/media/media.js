import {MediaPool, MediaType} from './MediaPool';

export const media = {
  playerPool: new MediaPool(),
  muteState: true,
  mute: function (value) {
    this.muteState = value;
    this.playerPool.blessAll(value);
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
