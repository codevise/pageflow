import {toHaveContentElementMargin} from './toHaveContentElementMargin';
import {toHaveScrollSpace} from './toHaveScrollSpace';
import {toHaveAlignment} from './toHaveAlignment';

export function useContentElementLayoutMatchers() {
  beforeEach(() => {
    expect.extend({
      toHaveContentElementMargin,
      toHaveScrollSpace,
      toHaveAlignment
    });
  });
}
