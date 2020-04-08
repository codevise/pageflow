export const PlayerPool = function(audio, options) {
  this.players = {};

  this.get = function(audioFileId) {
    this.players[audioFileId] =
      this.players[audioFileId] ||
      audio.createPlayer(audioFileId, options);

    return this.players[audioFileId];
  };

  this.dispose = function() {
    this.players = {};
  };
};