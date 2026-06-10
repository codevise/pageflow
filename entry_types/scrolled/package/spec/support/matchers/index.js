import {toHaveContentElementMargin} from './toHaveContentElementMargin';
import {toHaveScrollSpace} from './toHaveScrollSpace';
import {toHaveAlignment} from './toHaveAlignment';

import {toHaveSuppressedPadding} from './toHaveSuppressedPadding';
import {toHaveRemainingSpace} from './toHaveRemainingSpace';
import {toHaveForcedPadding} from './toHaveForcedPadding';
import {toHaveFadedOutForeground} from './toHaveFadedOutForeground';
import {toHavePerElementFadeTransition} from './toHavePerElementFadeTransition';
import {toHaveFirstBoxSuppressedTopMargin} from './toHaveFirstBoxSuppressedTopMargin';
import {toHaveConstrainedContentWidth} from './toHaveConstrainedContentWidth';

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
