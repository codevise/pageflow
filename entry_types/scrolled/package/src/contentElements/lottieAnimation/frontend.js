import {frontend} from 'pageflow-scrolled/frontend';

import {LottieAnimation} from './LottieAnimation';

frontend.contentElementTypes.register('lottieAnimation', {
  component: LottieAnimation,
  lifecycle: true,
  viewTimeline: true
});
