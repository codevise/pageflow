import {toContainContentElementBox} from './toContainContentElementBox';
import {toContainFitViewport} from './toContainFitViewport';
import {toRenderInputsMatching} from './toRenderInputsMatching';

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

/**
 * Register the configuration editor matchers for the surrounding
 * `describe` block: {@link toRenderInputsMatching}.
 *
 * Call inside a `describe` block. Content element plugins can use this to
 * assert that their configuration schema keeps up with their editor
 * integration.
 *
 * @example
 * import {
 *   renderContentElementConfigurationEditor, useConfigurationEditorMatchers
 * } from 'pageflow-scrolled/testHelpers';
 *
 * describe('myContentElement/editor', () => {
 *   useConfigurationEditorMatchers();
 *
 *   it('renders inputs described by schema', () => {
 *     expect(() => renderContentElementConfigurationEditor({entry, contentElement}))
 *       .toRenderInputsMatching(schema);
 *   });
 * });
 */
export function useConfigurationEditorMatchers() {
  beforeEach(() => {
    expect.extend({toRenderInputsMatching});
  });
}
