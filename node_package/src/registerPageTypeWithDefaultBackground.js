import registerPageType from './registerPageType';

import {
  PageBackgroundAsset,
  pageBackgroundReduxModule as mediaPageBackgroundReduxModule
} from 'media';

export default function(name, customPageType) {
  registerPageType(name, {
    component: PageBackgroundAsset,

    selectTargetElement(pageElement) {
      return pageElement.find('.page_background_asset')[0];
    },

    mixin: {
      scroller: true,
      ...customPageType
    },

    reduxModules: [mediaPageBackgroundReduxModule]
  });
}
