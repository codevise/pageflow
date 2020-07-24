import BackboneEvents from 'backbone-events-standalone';
import {browser, events, documentHiddenState} from 'pageflow/frontend';

export class Atmo {
  constructor({atmoSourceId, multiPlayer, backgroundMedia}){
    this.multiPlayer = multiPlayer;
    this.atmoSourceId = atmoSourceId;
    this.backgroundMedia = backgroundMedia;

    this.backgroundMedia.on('change:muted', () => {
      this.update();
    });

    documentHiddenState((hiddenState)=>{
      if (hiddenState === 'hidden') {
        this.multiPlayer.fadeOutIfPlaying();
      }
      else{
        this.update();
      }
    });

    this.listenTo(this.multiPlayer, 'playfailed', () => {
      backgroundMedia.mute(true);
    });
  }
  disable() {
    this.disabled = true;
    this.multiPlayer.fadeOutAndPause();
    
    events.trigger('atmo:disabled');
  }
  enable() {
    this.disabled = false;

    this.update();

    events.trigger('atmo:enabled');
  }
  pause() {
    if (browser.has('volume control support')) {
      return this.multiPlayer.fadeOutAndPause();
    }
    else {
      this.multiPlayer.pause();
    }
  }
  turnDown() {
    if (browser.has('volume control support')) {
      return this.multiPlayer.changeVolumeFactor(0.2);
    }
    else {
      this.multiPlayer.pause();
    }
  }
  resume() {
    if (this.multiPlayer.paused()) {
      if (this.disabled || this.backgroundMedia.muted) {
        return Promise.resolve();
      }
      else {
        return this.multiPlayer.resumeAndFadeIn();
      }
    }
    else {
      return this.multiPlayer.changeVolumeFactor(1);
    }
  }
  update() {    
    if (!this.disabled) {
      if (this.backgroundMedia.muted || this.atmoSourceId == undefined) {
        this.multiPlayer.fadeOutAndPause();
      }
      else {
        this.multiPlayer.fadeTo(this.atmoSourceId);
      }
    }
  }
  createMediaPlayerHooks(atmoDuringPlayback) {
    var atmo = this;

    return {
      before: function() {
        if (atmoDuringPlayback === 'mute') {
          atmo.pause();
        }
        else if (atmoDuringPlayback === 'turnDown') {
          atmo.turnDown();
        }
      },

      after: function() {
        atmo.resume();
      }
    };
  }

}

Object.assign(Atmo.prototype, BackboneEvents);
