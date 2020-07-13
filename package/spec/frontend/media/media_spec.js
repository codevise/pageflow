import {media, events} from 'pageflow/frontend';
import videojs from 'videojs';
import '$support/mediaElementStub';
import '$support/fakeBrowserFeatures';

describe('media', function() {
  let fileSources = [
    {type: 'audio/ogg', src: 'http://example.com/example.ogg'},
    {type: 'audio/m4a', src: 'http://example.com/example.m4a'},
    {type: 'audio/mp3', src: 'http://example.com/example.ogg'}
  ];

  describe('#getPlayer', function() {
    it('returns an instance of videojs.Player', function() {
      let player = media.getPlayer(fileSources, {});

      expect(Object.keys(videojs.players)).toContain(player.id());
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

    it('sets loop attribute to player', function () {
      let player = media.getPlayer(fileSources, {
        tagName: 'audio',
        loop: true
      });

      expect(player.getMediaElement().hasAttribute('loop')).toBe(true);
      expect(player.getMediaElement().getAttribute('loop')).toBe('');
    });

    it('updates player\'s context data', () => {
      let context = {
        page: {
          configuration: {
            title: 'chapter title'
          },
          index: 1,
        }
      };
      events.trigger = jest.fn();
      let player = media.getPlayer(fileSources, {
        tagName: 'audio',
        mediaEventsContextData:  context
      });      
      player.trigger('play');

      expect(events.trigger).toHaveBeenCalledWith(
        expect.stringContaining('media:'),
        expect.objectContaining({
          context: context
        })
      );
    });

    it('do not trigger media event when context is undefined', () => {
      events.trigger = jest.fn();
      let player = media.getPlayer(fileSources, {
        tagName: 'audio',
        mediaEventsContextData:  undefined
      });      
      player.trigger('play');

      expect(events.trigger).not.toHaveBeenCalled();
    });

    it('adds text tracks passed via textTracksSources option', () => {
      const player = media.getPlayer(fileSources, {
        tagName: 'audio',
        textTrackSources: [
          {srclang: 'de', src: 'sample.vtt'}
        ]
      });

      expect(player.textTracks().length).toEqual(1);
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

    it('apply mute on released player as well', function () {
      let player1 = media.getPlayer(fileSources, {});
      let player2 = media.getPlayer(fileSources, {});
      media.releasePlayer(player2);
      media.mute(true);

      expect(player1.muted()).toEqual(true);
      expect(player2.muted()).toEqual(true);
    });

    it('triggers change:muted event', () => {
      const listener = jest.fn();

      media.mute(true);
      media.on('change:muted', listener);
      media.mute(false);

      expect(listener).toHaveBeenCalledWith(false);
    });
  });

  describe('#muted', function() {
    it('returns state', function() {
      media.mute(true);
      expect(media.muted).toBe(true);

      media.mute(false);
      expect(media.muted).toBe(false);
    });
  });
});
