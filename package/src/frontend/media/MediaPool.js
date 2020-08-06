import {createMediaPlayer} from './createMediaPlayer';
import {blankSources} from './blankSources';

/** @const @enum {string} */
export const MediaType = {
  AUDIO: 'audio',
  VIDEO: 'video',
};

let elId = 0;

/**
 * Media pool class handles the pool of Videojs media players
 */
export class MediaPool {

  constructor(options = {playerCount: 4}){
    this.playerCount = options.playerCount;
    this.allocatedPlayers = {};
    this.unAllocatedPlayers = {};
    
    this.mediaFactory_ = {
      [MediaType.AUDIO]: () => {
        const audioEl = document.createElement('audio');
        audioEl.setAttribute('crossorigin', 'anonymous');
        return audioEl;
      },
      [MediaType.VIDEO]: () => {
        const videoEl = document.createElement('video');
        videoEl.setAttribute('crossorigin', 'anonymous');
        return videoEl;
      }
    }
  }
  allocatePlayer({playerType, playerId, playsInline, mediaEventsContextData,
                  hooks, poster, loop = false, controls = false}){
    let player = undefined;
    if (!this.unAllocatedPlayers[playerType]) {
      this.populateMediaPool_();
    }
    if (this.unAllocatedPlayers[playerType].length==0) {
      this.freeOnePlayer(playerType);
    }

    player = this.unAllocatedPlayers[playerType].pop();
    if (player) {
      
      player.pause();
      player.getMediaElement().loop = loop
      player.poster(poster);
      player.controls(controls)
      if (playsInline) {
        player.playsinline(true); 
      }
      player.updateHooks(hooks || {});
      player.updateMediaEventsContext(mediaEventsContextData);
      
      this.allocatedPlayers[playerType].push(player);
      player.playerId = playerId || this.allocatedPlayers[playerType].length
      return player;
    }
    else{
      console.log('no player found for allocation');
    }
  }
  freeOnePlayer(type){
    this.unAllocatePlayer(this.allocatedPlayers[type][0]); // free up the first allocated player
  }
  unAllocatePlayer(player){
    if (player) {
      let type = this.getMediaTypeFromEl(player.el());    
      this.allocatedPlayers[type] = this.allocatedPlayers[type].filter(p=>p!=player);
      
      player.controls(false);
      player.getMediaElement().loop = false;
      player.playsinline(false);
      player.getMediaElement().setAttribute('src', blankSources[type]);
      player.poster('');

      clearTextTracks(player);

      this.unAllocatedPlayers[type].push(player);
    }
  }
  blessAll(value){
    if (this.unAllocatedPlayers[MediaType.AUDIO]==undefined || this.unAllocatedPlayers[MediaType.VIDEO]==undefined) {
      this.populateMediaPool_();
    }
    this.forEachMediaType((key)=>{
      this.allPlayersForType(MediaType[key]).forEach( (player) => {
        player.muted(value);
      });
    });
  }
  allPlayersForType(type){
    if (this.unAllocatedPlayers[type]) {
     return [...this.unAllocatedPlayers[type], ...this.allocatedPlayers[type]] 
    }
    return [];
  }
  getMediaTypeFromEl(mediaElement){
    let tagName = mediaElement.tagName.toLowerCase();
    if (tagName=='div') {
      tagName = mediaElement.children[0].tagName.toLowerCase();
    }
    return this.getMediaType(tagName);
  }
  getMediaType(tagName){
    switch (tagName) {
      case 'audio':
        return MediaType.AUDIO;
      case 'video':
        return MediaType.VIDEO;
    }
  }
  forEachMediaType(callbackFn) {
    Object.keys(MediaType).forEach(callbackFn.bind(this));
  }
  createPlayer_(type, mediaEl){
    mediaEl.setAttribute('pool-element', elId++);
    if (!this.unAllocatedPlayers[type]) {
      this.unAllocatedPlayers[type] = [];
      this.allocatedPlayers[type] = [];
    }
    let player = createMediaPlayer({
      mediaElement: mediaEl,
      tagName: type
    });
    mediaEl.setAttribute('src', blankSources[type]);
    this.unAllocatedPlayers[type].push(player);
    return player;
  }
  initializeMediaPool_(type, mediaElSeed){
    while ( this.allPlayersForType(type).length<this.playerCount ) {
      this.createPlayer_(type, mediaElSeed.cloneNode(true));
    }
  }
  populateMediaPool_(){
    this.forEachMediaType((key)=>{
      let type = MediaType[key];
      let mediaEl = this.mediaFactory_[type].call(this);
      this.initializeMediaPool_(type, mediaEl);
    });
  }
}

function clearTextTracks(player) {
  const tracks = player.textTracks();
  let i = tracks.length;

  while (i--) {
    player.removeRemoteTextTrack(tracks[i]);
  }
}
