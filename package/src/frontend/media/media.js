import {createMediaPlayer} from './createMediaPlayer';

export const media = {
  players: {},
  mute: function (value) {
    Object.values(this.players).forEach(function(player){
      player.muted(value);
    });
  },
  getPlayer: function (fileSource, options) {
    options.playerId = options.playerId || Object.keys(this.players).length;
    let player = createMediaPlayer(options);
    player.src(fileSource);
    this.players[options.playerId] = player;
    player.playerId = options.playerId;
    return player;
  },
  releasePlayer: function (player) {
    delete this.players[player.playerId];
  }
};