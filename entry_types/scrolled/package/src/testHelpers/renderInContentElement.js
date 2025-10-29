import React, {useContext} from 'react';
import {DndProvider} from 'react-dnd';
import {HTML5Backend} from 'react-dnd-html5-backend';
import BackboneEvents from 'backbone-events-standalone';
import {act} from '@testing-library/react'

import {
  ContentElementAttributesProvider,
  ContentElementEditorCommandEmitterContext,
  ContentElementEditorStateContext,
  ContentElementLifecycleContext,
  PhonePlatformContext
} from 'pageflow-scrolled/frontend';

import {Consent} from 'pageflow/frontend';

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
 * @param {Object} [options.consentState] - Pass 'undecided' to render third party consent opt in.
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
                                            consentState = 'accepted',
                                            seed,
                                            ...options} = {}) {
  const emitter = Object.assign({}, BackboneEvents);

  function Wrapper({children}) {
    const defaultEditorState = useContext(ContentElementEditorStateContext);

    return (
      <PhonePlatformContext.Provider value={phonePlatform}>
        <DndProvider backend={HTML5Backend}>
          <ContentElementAttributesProvider id={42}>
            <ContentElementEditorCommandEmitterContext.Provider
              value={emitter}>
              <ContentElementEditorStateContext.Provider
                value={{...defaultEditorState, ...editorState}}>
                {OriginalWrapper ? <OriginalWrapper children={children} /> : children}
              </ContentElementEditorStateContext.Provider>
            </ContentElementEditorCommandEmitterContext.Provider>
          </ContentElementAttributesProvider>
        </DndProvider>
      </PhonePlatformContext.Provider>
    );
  }

  return {
    ...renderInEntryWithScrollPositionLifecycle(
      ui,
      {
        lifecycleContext: ContentElementLifecycleContext,
        wrapper: Wrapper,
        consent: createConsent(consentState),
        seed: {
          ...consentSeed,
          ...seed
        },
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

function createConsent(consentState) {
  const consent = Consent.create();

  consent.registerVendor('testVendor', {
    displayName: 'Test Vendor',
    description: 'Test embeds',
    paradigm: 'lazy opt-in'
  });

  consent.closeVendorRegistration();

  if (consentState === 'accepted') {
    consent.accept('testVendor');
  }

  return consent;
}

const consentSeed = {
  consentVendors: [{
    name: 'testVendor',
    paradigm: 'lazy opt-in'
  }],
  contentElementConsentVendors: {42: 'testVendor'}
};
