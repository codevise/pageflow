import _ from 'underscore';
import {media, PlayerSourceIDMap, MultiPlayer} from 'pageflow/frontend';
import {Atmo} from 'frontend/Atmo';

import 'support/mediaElementStub';

describe('Atmo', function() {

  let fileSources = [
    {type: 'audio/ogg', src: 'http://example.com/example.ogg'},
    {type: 'audio/m4a', src: 'http://example.com/example.m4a'},
    {type: 'audio/mp3', src: 'http://example.com/example.ogg'}
  ];
  
  let updateAtmo = (config, pool, atmo) => {
    if (config.sources) {
      pool.mapSources(config.atmoAudioFileId, config.sources);
    }
    
    atmo.atmoSourceId = config.atmoAudioFileId;
    atmo.update();
  }

  describe('update', function(){
    it('fades to atmo audio file', function() {
      let {pool, atmo, multiPlayer} = buildAtmo({});
      let multiPlayerSpy = jest.spyOn(multiPlayer, 'fadeTo');
      
      media.mute(false);    
      updateAtmo({
        sources: fileSources,
        atmoAudioFileId: 5
      }, pool, atmo);

      expect(multiPlayerSpy).toHaveBeenCalledWith(5);
    });


    it('does not fade to audio file if atmo is disabled', function() {
      let {pool, atmo, multiPlayer} = buildAtmo({});
      let multiPlayerSpy = jest.spyOn(multiPlayer, 'fadeTo');
      
      media.mute(false);
      atmo.disable();
      updateAtmo({
        sources: fileSources,
        atmoAudioFileId: 5
      }, pool, atmo);
      
      expect(multiPlayerSpy).not.toHaveBeenCalledWith(5);
    });

    it('pauses multiPlayer if backgroundMedia is muted', function() {
      let {pool, atmo, multiPlayer} = buildAtmo({});
      let multiPlayerSpy = jest.spyOn(multiPlayer, 'fadeOutAndPause');
      
      media.mute(true);
      updateAtmo({
        sources: fileSources,
        atmoAudioFileId: 5
      }, pool, atmo);
      
      expect(multiPlayerSpy).toHaveBeenCalled();
    });

    it('pauses multiPlayer on documment hidden state', function() {
      let {pool, atmo, multiPlayer} = buildAtmo({});
      let multiPlayerSpy = jest.spyOn(multiPlayer, 'fadeOutIfPlaying');

      updateAtmo({
        sources: fileSources,
        atmoAudioFileId: 5
      }, pool, atmo);
      Object.defineProperty(global.document, 'visibilityState', { value: 'hidden', writable: true });
      document.dispatchEvent(new Event('visibilitychange'));

      expect(multiPlayerSpy).toHaveBeenCalled();
    });

    it('updates atmo on documment visible state', function() {
      let {pool, atmo, multiPlayer} = buildAtmo({});
      let atmoSpy = jest.spyOn(atmo, 'update');

      updateAtmo({
        sources: fileSources,
        atmoAudioFileId: 5
      }, pool, atmo);
      document.visibilityState = 'visible';
      document.dispatchEvent(new Event('visibilitychange'));

      expect(atmoSpy).toHaveBeenCalled();
    });

  });


  describe('on multiPlayer playfailed event', function() {
    it('mutes background media', function() {
      let {pool, atmo, multiPlayer} = buildAtmo({});
      media.mute(false);
      let mediaSpy = jest.spyOn(media, 'mute');

      updateAtmo({
        sources: fileSources,
        atmoAudioFileId: 5
      }, pool, atmo);

      multiPlayer.trigger('playfailed');
      
      expect(mediaSpy).toHaveBeenCalled();
    });
  });

  describe('#pause', function() {
    it('calls fadeOutAndPause on multiPlayer', function() {
      let {pool, atmo, multiPlayer} = buildAtmo({});
      let multiPlayerSpy = jest.spyOn(multiPlayer, 'fadeOutAndPause');

      updateAtmo({
        sources: fileSources,
        atmoAudioFileId: 5
      }, pool, atmo);

      atmo.pause();
      
      expect(multiPlayerSpy).toHaveBeenCalled();
    });
  });

  describe('#resume', function() {
    describe('when multiPlayer is paused', function() {
      it('calls resumeAndFadeIn on multiPlayer', function() {
        let {pool, atmo, multiPlayer} = buildAtmo({});
        let multiPlayerSpy = jest.spyOn(multiPlayer, 'resumeAndFadeIn');

        updateAtmo({
          sources: fileSources,
          atmoAudioFileId: 5
        }, pool, atmo);

        media.mute(false);
        atmo.resume();
        
        expect(multiPlayerSpy).toHaveBeenCalled();
      });

      it('does not call resumeAndFadeIn on multiPlayer if atmo is disabled', function() {
        let {pool, atmo, multiPlayer} = buildAtmo({});
        let multiPlayerSpy = jest.spyOn(multiPlayer, 'resumeAndFadeIn');

        updateAtmo({
          sources: fileSources,
          atmoAudioFileId: 5
        }, pool, atmo);

        media.mute(false);
        atmo.disable();
        atmo.resume();
        
        expect(multiPlayerSpy).not.toHaveBeenCalled();
      });

      it('does not call resumeAndFadeIn on multiPlayer if background media is muted', function() {
        let {pool, atmo, multiPlayer} = buildAtmo({});
        let multiPlayerSpy = jest.spyOn(multiPlayer, 'resumeAndFadeIn');

        updateAtmo({
          sources: fileSources,
          atmoAudioFileId: 5
        }, pool, atmo);

        media.mute(true);
        atmo.resume();
        
        expect(multiPlayerSpy).not.toHaveBeenCalled();
      });
    });
   });

  describe('#enable', function() {
    it('fades to atmo audio file of current section', function() {
      let {pool, atmo, multiPlayer} = buildAtmo({});
      let fadeToSpy = jest.spyOn(multiPlayer, 'fadeTo');

      updateAtmo({
        sources: fileSources,
        atmoAudioFileId: 5
      }, pool, atmo);

      atmo.disable();
      media.mute(false);
      atmo.enable();

      expect(fadeToSpy).toHaveBeenCalledWith(5);
    });
  });

  function buildAtmo(options) {
    let pool = PlayerSourceIDMap(media);
    let multiPlayer = new MultiPlayer(pool, {
      loop: true,
      fadeDuration: 500,
      crossFade: true,
      playFromBeginning: false,
      rewindOnChange: true,
      pauseInBackground: true
    });
    let atmo = new Atmo({
      pool: pool,
      backgroundMedia: media,
      multiPlayer: multiPlayer
    });
    return {
      atmo: atmo,
      multiPlayer: multiPlayer,
      pool: pool
    };
  }
});
