import {toContainContentElementBox} from './toContainContentElementBox';
import {toContainFitViewport} from './toContainFitViewport';

/**
 * Register the public content element matchers for the surrounding
 * `describe` block: {@link toContainContentElementBox} and
 * {@link toContainFitViewport}.
 *
 * Call inside a `describe` block. Content element plugins can use this to
 * assert that their component opts into the framework chrome correctly.
 *
 * @example
 * import {renderInContentElement, useContentElementMatchers} from 'pageflow-scrolled/testHelpers';
 *
 * describe('MyContentElement', () => {
 *   useContentElementMatchers();
 *
 *   it('renders inside a box', () => {
 *     const {container} = renderInContentElement(<MyContentElement />);
 *     expect(container).toContainContentElementBox();
 *   });
 * });
 */
export function useContentElementMatchers() {
  beforeEach(() => {
    expect.extend({
      toContainContentElementBox,
      toContainFitViewport
    });
  });
}
