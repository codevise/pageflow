import Page from './components/Page';
import PageVideoPlayer from './components/PageVideoPlayer';
import MobilePageVideoPoster from './components/MobilePageVideoPoster';
import PageBackgroundVideo from './components/PageBackgroundVideo';
import PageBackgroundAsset from './components/PageBackgroundAsset';
import PageBackground from './components/PageBackground';
import PagePrintImage from './components/PagePrintImage';

import createReducer from './createReducer';
import pageSaga from './sagas';

import fadeInWhenPageWillActivate from './sagas/fadeInWhenPageWillActivate';
import fadeOutWhenPageWillDeactivate from './sagas/fadeOutWhenPageWillDeactivate';

export function reduxModule(options) {
  return {
    reducers: {
      'media.default': createReducer({scope: 'default'}),
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
      fadeOutWhenPageWillDeactivate({scope: 'background'})
    ];
  }
};

export {
  Page,
  PageVideoPlayer,
  MobilePageVideoPoster,
  PagePrintImage,
  PageBackgroundVideo,
  PageBackgroundAsset,
  PageBackground
};
