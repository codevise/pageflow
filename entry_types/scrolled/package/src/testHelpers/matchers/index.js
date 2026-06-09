import {toContainContentElementBox} from './toContainContentElementBox';
import {toContainFitViewport} from './toContainFitViewport';

export function useContentElementMatchers() {
  beforeEach(() => {
    expect.extend({
      toContainContentElementBox,
      toContainFitViewport
    });
  });
}
