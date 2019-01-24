import Page from './components/Page';
import PageAudioFilePlayer from './components/PageAudioFilePlayer';
import PageVideoPlayer from './components/PageVideoPlayer';
import MobilePageVideoPoster from './components/MobilePageVideoPoster';
import PageBackgroundVideo from './components/PageBackgroundVideo';
import PageBackgroundAsset from './components/PageBackgroundAsset';
import PageBackground from './components/PageBackground';
import PagePrintImage from './components/PagePrintImage';
import WaveformPlayerControls from './components/WaveformPlayerControls';

import createReducer from './createReducer';
import pageScrollerMarginReducer from './pageScrollerMargin/reducer';
import pageSaga from './sagas';

import fadeInWhenPageWillActivate from './sagas/fadeInWhenPageWillActivate';
import fadeOutWhenPageWillDeactivate from './sagas/fadeOutWhenPageWillDeactivate';
import muteBackgroundMediaOnPlayFailed from './sagas/muteBackgroundMediaOnPlayFailed';

export function reduxModule(options) {
  return {
    reducers: {
      'media.default': createReducer({scope: 'default'}),
      'media.pageScrollerMargin': pageScrollerMarginReducer
    },

    saga: function*() {
      yield pageSaga(options);
    }
  };
}

export const pageBackgroundReduxModule = {
  reducers: {
    'media.background': createReducer({scope: 'background'}),
  },

  saga: function*() {
    yield [
      fadeInWhenPageWillActivate({scope: 'background'}),
      fadeOutWhenPageWillDeactivate({scope: 'background'}),
      muteBackgroundMediaOnPlayFailed()
    ];
  }
};

export {
  Page,
  PageAudioFilePlayer,
  PageVideoPlayer,
  MobilePageVideoPoster,
  PagePrintImage,
  PageBackgroundVideo,
  PageBackgroundAsset,
  PageBackground,
  WaveformPlayerControls
};
