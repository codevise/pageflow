import {media} from 'pageflow/frontend';
import _ from 'underscore';
import '$support/mediaElementStub';
import '$support/fakeBrowserFeatures';

describe('media', function() {
  afterEach(() => {
    _.each(media.players, (player)=>{
      player.dispose();
    });
    media.players = {};
  });

  let fileSources =[ 
    {type: 'audio/ogg', src: 'http://example.com/example.ogg'},
    {type: 'audio/m4a', src: 'http://example.com/example.m4a'},
    {type: 'audio/mp3', src: 'http://example.com/example.ogg'}
  ];

  describe('#getPlayer', function() {
    
    it('player id has a prefix pageflow_media_element_', function() {
      let player = media.getPlayer(fileSources, {});
      
      expect(player.id()).toMatch(/pageflow_media_element_(.*)/);
    });

    it('returns an instance of videojs.Player', function() {
      let player = media.getPlayer(fileSources, {});

      expect(player).toEqual(videojs.players.pageflow_media_element_0);
    });

    it('renders media element with the provided source', function () {
      let player = media.getPlayer(fileSources, {});
      let sources = player.currentSources(); //source gets reflects in media html element after some interval
      
      expect(sources).toEqual(fileSources);
    });

    it('renders media video element when there is no tagName given', function () {
      let player = media.getPlayer(fileSources, {});
      let element = player.el();

      expect(element).toHaveDescendant('video');
    });

    it('renders media element with the playsinline attribute', function () {
      let player = media.getPlayer(fileSources, {
        tagName: 'audio',
        playsInline: true
      });
      let element = player.el();

      expect(element).toHaveDescendant('audio[playsinline]');
    });
    
    it('renders media element with the loop attribute', function () {
      let player = media.getPlayer(fileSources, {
        tagName: 'audio',
        loop: true
      });
      let element = player.el();

      expect(element).toHaveDescendant('audio[loop]');
    });

  });

  describe('#mute', function() {
    
    it('mutes all the players', function() {
      let player1 = media.getPlayer(fileSources, {});
      let player2 = media.getPlayer(fileSources, {});
      media.mute(true);

      expect(player1.muted()).toEqual(true);
      expect(player2.muted()).toEqual(true);
    });
    
    it('unmutes all the players', function() {
      let player1 = media.getPlayer(fileSources, {});
      let player2 = media.getPlayer(fileSources, {});
      media.mute(false);

      expect(player1.muted()).toEqual(false);
      expect(player2.muted()).toEqual(false);
    });

    it('should not apply mute on released player', function () {
      let player1 = media.getPlayer(fileSources, {});
      let player2 = media.getPlayer(fileSources, {});
      media.releasePlayer(player2);
      media.mute(true);

      expect(player1.muted()).toEqual(true);
      expect(player2.muted()).toEqual(false);
    });

  });
});