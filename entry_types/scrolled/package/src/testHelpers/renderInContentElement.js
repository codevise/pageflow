import React, {useContext} from 'react';
import BackboneEvents from 'backbone-events-standalone';
import {act} from '@testing-library/react'

import {
  ContentElementAttributesProvider,
  ContentElementEditorCommandEmitterContext,
  ContentElementEditorStateContext,
  ContentElementLifecycleContext,
  PhonePlatformContext
} from 'pageflow-scrolled/frontend';

import {renderInEntryWithScrollPositionLifecycle} from './scrollPositionLifecycle';

/**
 * Provide context as if component was rendered inside of a content element.
 *
 * Returns two additionals functions to control content element scroll
 * lifecycle and editor commands: `simulateScrollPosition` and `triggerEditorCommand`.
 *
 * @param {Function} callback - React component or function returning a React component.
 * @param {Object} [options] - Supports all options supported by {@link `renderInEntry`}.
 * @param {Object} [options.editorState] - Fake result of `useContentElementEditorState`.
 * @param {Object} [options.phonePlatform] - Fake result of `usePhonePlatform`.
 *
 * @example
 *
 * const {getByRole, simulateScrollPosition, triggerEditorCommand} =
 *   renderInContentElement(<MyContentElement />, {
 *     seed: {...}
 *   });
 * simulateScrollPosition('near viewport');
 * triggerEditorCommand({type: 'HIGHLIGHT'});
 */
export function renderInContentElement(ui, {editorState,
                                            phonePlatform = false,
                                            wrapper: OriginalWrapper,
                                            ...options}) {
  const emitter = Object.assign({}, BackboneEvents);

  function Wrapper({children}) {
    const defaultEditorState = useContext(ContentElementEditorStateContext);

    return (
      <PhonePlatformContext.Provider value={phonePlatform}>
        <ContentElementAttributesProvider id={42}>
          <ContentElementEditorCommandEmitterContext.Provider
            value={emitter}>
            <ContentElementEditorStateContext.Provider
              value={{...defaultEditorState, ...editorState}}>
              {OriginalWrapper ? <OriginalWrapper children={children} /> : children}
            </ContentElementEditorStateContext.Provider>
          </ContentElementEditorCommandEmitterContext.Provider>
        </ContentElementAttributesProvider>
      </PhonePlatformContext.Provider>
    );
  }

  return {
    ...renderInEntryWithScrollPositionLifecycle(
      ui,
      {
        lifecycleContext: ContentElementLifecycleContext,
        wrapper: Wrapper,
        ...options
      }
    ),
    triggerEditorCommand(command) {
      act(() => {
        emitter.trigger(`command:42`, command)
      })
    }
  };
}
