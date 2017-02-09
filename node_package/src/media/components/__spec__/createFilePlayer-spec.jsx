import createFilePlayer from '../createFilePlayer';

import {expect} from 'support/chai';
import {mount} from 'enzyme';
import sinon from 'sinon';
import Backbone from 'backbone';

describe('createFilePlayer', () => {
  describe('returns component that', () => {
    function setup({
      tagName = 'video',
      sources = () => [],
      poster,
      emulateTextTracksDisplay,
      createPlayer,
    } = {}) {
      const mockPlayer = createMockPlayer();

      const FilePlayer = createFilePlayer({
        tagName,
        sources,
        poster,
        emulateTextTracksDisplay,
        createPlayer: createPlayer || (el => {
          mockPlayer.el = el;
          return mockPlayer;
        })
      }).WrappedComponent;

      return {FilePlayer, mockPlayer};
    }

    const requiredProps = {
      file: {},
      playerState: {},
      playerActions: {},

      updateTextTrackSettings() {}
    };

    it('renders media tag with given tag name', () => {
      const {FilePlayer} = setup({
        tagName: 'audio'
      });

      const wrapper = mount(<FilePlayer {...requiredProps} />);

      expect(wrapper.render()).to.have.descendants('audio');
    });

    it('renders media tag with given sources', () => {
      const {FilePlayer} = setup({
        sources: file => [
          {type: 'video/mp4', src: file.src}
        ]
      });
      const file = {
        src: 'some.mp4'
      };

      const wrapper = mount(<FilePlayer file={file} playerState={{}} playerActions={{}}/>);

      expect(wrapper.render()).to.have.descendants('source[src="some.mp4"]');
    });

    it('passes quality to sources function', () => {
      const {FilePlayer} = setup({
        sources: (file, quality) => [
          {type: 'video/mp4', src: `${quality}.mp4`}
        ]
      });

      const wrapper = mount(<FilePlayer {...requiredProps} quality="high" />);

      expect(wrapper.render()).to.have.descendants('source[src="high.mp4"]');
    });

    it('renders media tag with poster given by option', () => {
      const {FilePlayer} = setup({
        poster: file => file.posterUrl
      });
      const file = {
        posterUrl: 'some-poster.png'
      };

      const wrapper = mount(<FilePlayer {...requiredProps} file={file} />);

      expect(wrapper.render()).to.have.descendants('video[data-poster="some-poster.png"]');
    });

    it('renders media tag with ready text tracks from props', () => {
      const {FilePlayer} = setup();
      const textTracks = {
        files: [{srclang: 'en', urls: {vtt: 'some.vtt'}, isReady: true}]
      };

      const wrapper = mount(<FilePlayer {...requiredProps} textTracks={textTracks} />);

      expect(wrapper.render()).to.have.descendants('track[srclang="en"]');
    });

    it('does not render text tracks that are not ready', () => {
      const {FilePlayer} = setup();
      const textTracks = {
        files: [{srclang: 'en', urls: {vtt: 'some.vtt'}, isReady: false}]
      };

      const wrapper = mount(<FilePlayer {...requiredProps} textTracks={textTracks} />);

      expect(wrapper.render()).not.to.have.descendants('track');
    });

    it('does not render text tracks when text tracks are disabled', () => {
      const {FilePlayer} = setup();
      const textTracks = {
        files: [{srclang: 'en', urls: {vtt: 'some.vtt'}}]
      };

      const wrapper = mount(<FilePlayer {...requiredProps}
                                        textTracksEnabled={false}
                                        textTracks={textTracks} />);

      expect(wrapper.render()).not.to.have.descendants('track');
    });

    [
      {event: 'play', action: 'playing'},
      {event: 'pause', action: 'paused'},
      {event: 'loadedmetadata', action: 'metaDataLoaded', payload: {currentTime: 5, duration: 10}},
      {event: 'timeupdate', action: 'timeUpdate', payload: {currentTime: 5}},
      {event: 'ended', action: 'ended'},
    ].forEach(({action, event, payload}) => {
      it(`invokes ${action} playerAction when player emits ${event}`, () => {
        const {FilePlayer, mockPlayer} = setup();
        const playerActions = {
          [action]: sinon.spy()
        };

        mount(<FilePlayer {...requiredProps} playerActions={playerActions}/>);

        mockPlayer.currentTime.returns(5);
        mockPlayer.duration.returns(10);
        mockPlayer.trigger(event);

        expect(playerActions[action]).to.have.been.calledWith(payload);
      });
    });

    it('calls play on player when shouldPlay changes to true in playerState', () => {
      const {FilePlayer, mockPlayer} = setup();

      const wrapper = mount(<FilePlayer {...requiredProps} playerState={{shouldPlay: false}} />);

      wrapper.setProps({playerState: {shouldPlay: true}});

      expect(mockPlayer.play).to.have.been.called;
    });

    it('calls playAndFadeIn on player when shouldPlay changes to true and fadeDuration is present', () => {
      const {FilePlayer, mockPlayer} = setup();

      const wrapper = mount(<FilePlayer {...requiredProps} playerState={{shouldPlay: false}} />);

      wrapper.setProps({playerState: {shouldPlay: true, fadeDuration: 500}});

      expect(mockPlayer.playAndFadeIn).to.have.been.calledWith(500);
    });

    it('calls pause on player when shouldPlay changes to false in playerState', () => {
      const {FilePlayer, mockPlayer} = setup();

      const wrapper = mount(<FilePlayer {...requiredProps}
                                        playerState={{shouldPlay: true}} />);

      wrapper.setProps({playerState: {shouldPlay: false}});

      expect(mockPlayer.pause).to.have.been.called;
    });

    it('calls fadeOutAndPause on player when shouldPlay changes to false and fadeDuration is present', () => {
      const {FilePlayer, mockPlayer} = setup();

      const wrapper = mount(<FilePlayer {...requiredProps}
                                        playerState={{shouldPlay: true}} />);

      wrapper.setProps({playerState: {shouldPlay: false, fadeDuration: 500}});

      expect(mockPlayer.fadeOutAndPause).to.have.been.calledWith(500);
    });

    it('disposes the player when the component unmounts', () => {
      const {FilePlayer, mockPlayer} = setup();

      const wrapper = mount(<FilePlayer {...requiredProps} />);

      wrapper.unmount();

      expect(mockPlayer.dispose).to.have.been.called;
    });

    it('passes atmo settings to createPlayer function', () => {
      let passedAtmoSettings;
      const {FilePlayer} = setup({
        createPlayer: (element, {atmoSettings}) => {
          passedAtmoSettings = atmoSettings;
          return createMockPlayer();
        }
      });

      mount(<FilePlayer {...requiredProps}
                        atmoDuringPlayback="pause" />);

      expect(passedAtmoSettings).to.eql({'atmo_during_playback': 'pause'});
    });

    it('updates atmo settings that are passed to player in place', () => {
      let passedAtmoSettings;
      const {FilePlayer} = setup({
        createPlayer: (element, {atmoSettings}) => {
          passedAtmoSettings = atmoSettings;
          return createMockPlayer();
        }
      });

      const wrapper = mount(<FilePlayer {...requiredProps}
                                        atmoDuringPlayback="pause" />);

      wrapper.setProps({atmoDuringPlayback: 'play'});

      expect(passedAtmoSettings).to.eql({'atmo_during_playback': 'play'});
    });

    it('passes emulateTextTracksDisplay to createPlayer function', () => {
      let passedValue;
      const {FilePlayer} = setup({
        emulateTextTracksDisplay: true,
        createPlayer: (element, {emulateTextTracksDisplay}) => {
          passedValue = emulateTextTracksDisplay;
          return createMockPlayer();
        }
      });

      mount(<FilePlayer {...requiredProps}
                        atmoDuringPlayback="pause" />);

      expect(passedValue).to.eq(true);
    });

    it('passes mediaContext from context to createPlayer function', () => {
      let passedMediaContext;
      const {FilePlayer} = setup({
        emulateTextTracksDisplay: true,
        createPlayer: (element, {mediaContext}) => {
          passedMediaContext = mediaContext;
          return createMockPlayer();
        }
      });
      const mediaContext = {};

      mount(<FilePlayer {...requiredProps} />,
            {context: {mediaContext}});

      expect(passedMediaContext).to.eq(mediaContext);
    });

    it('updates text track modes on mount', () => {
      const {FilePlayer, mockPlayer} = setup();
      const textTracks = {
        files: [
          {id: 5, urls: {vtt: 'some.vtt'}, isReady: true},
          {id: 6, urls: {vtt: 'other.vtt'}, isReady: true}
        ],
        activeFileId: 5
      };

      mount(<FilePlayer {...requiredProps}
                        textTracks={textTracks} />);

      expect(mockPlayer.textTracks()[0].mode).to.eq('showing');
      expect(mockPlayer.textTracks()[1].mode).to.eq('disabled');
    });

    it('updates text track modes when text tracks settings change', () => {
      const {FilePlayer, mockPlayer} = setup();
      const textTracks = {
        files: [
          {id: 5, urls: {vtt: 'some.vtt'}, isReady: true},
          {id: 6, urls: {vtt: 'other.vtt'}, isReady: true}
        ]
      };

      const wrapper = mount(<FilePlayer {...requiredProps}
                                        textTracks={textTracks} />);
      wrapper.setProps({
        textTracks: {
          ...textTracks,
          activeFileId: 5
        }
      });

      expect(mockPlayer.textTracks()[0].mode).to.eq('showing');
      expect(mockPlayer.textTracks()[1].mode).to.eq('disabled');
    });

    it('does not reset text track modes if browser has native video player', () => {
      const {FilePlayer, mockPlayer} = setup();
      const textTracks = {
        files: [
          {id: 5, urls: {vtt: 'some.vtt'}, isReady: true},
          {id: 6, urls: {vtt: 'other.vtt'}, isReady: true}
        ],
        activeFileId: 5
      };

      mount(<FilePlayer {...requiredProps}
                        textTracks={textTracks}
                        hasNativeVideoPlayer={true} />);

      expect(mockPlayer.textTracks()[0].mode).not.to.eq('showing');
    });
  });

  function createMockPlayer(element) {
    return {
      currentTime: sinon.stub(),
      duration: sinon.stub(),
      isAudio: sinon.stub(),

      // Emulate VideoJS textTracks interface
      textTracks: function() {
        return this.el ? [].slice.call(this.el.querySelectorAll('track')).map(track => {
          const fakeTrack = {};

          ['id', 'label', 'mode', 'kind', 'src'].forEach(property =>
            Object.defineProperty(fakeTrack, property, {
              get() {
                return track.getAttribute(property);
              },

              set(value) {
                track.setAttribute(property, value);
              }
            })
          );

          Object.defineProperty(fakeTrack, 'language', {
            get() {
              return track.getAttribute('srclang');
            },

            set(value) {
              track.setAttribute('srclang', value);
            }
          });

          return fakeTrack;
        }) : [];
      },

      play: sinon.spy(),
      playAndFadeIn: sinon.spy(),
      pause: sinon.spy(),
      fadeOutAndPause: sinon.spy(),
      dispose: sinon.spy(),

      updateCueLineSettings: sinon.spy(),

      ...Backbone.Events,
      one(...args) { this.once(...args); }
    };
  }
});
