import {toHaveContentElementMargin} from './contentElement/toHaveContentElementMargin';
import {toHaveScrollSpace} from './contentElement/toHaveScrollSpace';
import {toHaveAlignment} from './contentElement/toHaveAlignment';

import {toHaveSuppressedPadding} from './section/toHaveSuppressedPadding';
import {toHaveRemainingSpace} from './section/toHaveRemainingSpace';
import {toHaveForcedPadding} from './section/toHaveForcedPadding';
import {toHaveFadedOutForeground} from './section/toHaveFadedOutForeground';
import {toHavePerElementFadeTransition} from './section/toHavePerElementFadeTransition';
import {toHaveFirstBoxSuppressedTopMargin} from './section/toHaveFirstBoxSuppressedTopMargin';
import {toHaveConstrainedContentWidth} from './section/toHaveConstrainedContentWidth';

export function useContentElementLayoutMatchers() {
  beforeEach(() => {
    expect.extend({
      toHaveContentElementMargin,
      toHaveScrollSpace,
      toHaveAlignment
    });
  });
}

export function useSectionMatchers() {
  beforeEach(() => {
    expect.extend({
      toHaveSuppressedPadding,
      toHaveRemainingSpace,
      toHaveForcedPadding,
      toHaveFadedOutForeground,
      toHavePerElementFadeTransition,
      toHaveFirstBoxSuppressedTopMargin,
      toHaveConstrainedContentWidth
    });
  });
}
