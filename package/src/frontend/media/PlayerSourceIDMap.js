
export const PlayerSourceIDMap = function (media) {  
  return {
    current: undefined,
    previous: undefined,
    mapSources: function (id, sources) {
      this[id] = sources;
    },
    get: function (sourceID, options) {
      if (this.previous && this.previous.playerId === sourceID) {
        let holder = this.current;
        this.current = this.previous;
        this.previous = holder;
      }
      else{
        media.releasePlayer(this.previous);
        this.previous = this.current;
        this.current = media.getPlayer(this[sourceID], {
          filePermaId: sourceID,
          playerId: sourceID,
          ...options
        });
      }
      return this.current;
    }
  }
}
