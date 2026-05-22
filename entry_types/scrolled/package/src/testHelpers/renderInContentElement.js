import React, {useEffect, useState} from 'react';
import {DndProvider} from 'react-dnd';
import {HTML5Backend} from 'react-dnd-html5-backend';
import BackboneEvents from 'backbone-events-standalone';
import {act} from '@testing-library/react'

import {
  ContentElementAttributesProvider,
  ContentElementEditorCommandEmitterContext,
  ContentElementEditorStateContext,
  ContentElementLifecycleContext,
  MainStorylineActivity
} from 'pageflow-scrolled/frontend';

import {Consent} from 'pageflow/frontend';

import {renderInEntryWithScrollPositionLifecycle} from './scrollPositionLifecycle';

/**
 * Provide context as if component was rendered inside of a content element.
 *
 * Returns additional functions to control content element scroll
 * lifecycle, editor commands, and storyline mode: `simulateScrollPosition`,
 * `triggerEditorCommand`, and `simulateStorylineMode`.
 *
 * @param {Function} callback - React component or function returning a React component.
 * @param {Object} [options] - Supports all options supported by {@link `renderInEntry`}.
 * @param {boolean|Object} [options.inlineEditing] -
 *   Opt the content element into an inline-editing context (matching
 *   what's available when inline editing is loaded in production).
 *   Pass `true` for editable defaults, or an object to override:
 *   `{isEditable, isSelected, transientState}`. `transientState` is
 *   installed as the `setTransientState` function on the editor state
 *   context — pass a jest spy to assert on it. Omitting the option
 *   gives the frontend-mode defaults (`isEditable: false, isSelected:
 *   false, setTransientState: noop`) without wrapping any
 *   inline-editing-only providers (DndProvider, editor command
 *   emitter).
 * @param {Object} [options.phonePlatform] - Fake result of `usePhonePlatform`.
 * @param {Object} [options.consentState] - Pass 'undecided' to render third party consent opt in.
 *
 * @example
 *
 * const {getByRole, simulateScrollPosition, triggerEditorCommand, simulateStorylineMode} =
 *   renderInContentElement(<MyContentElement />, {
 *     seed: {...},
 *     inlineEditing: {isSelected: true}
 *   });
 * simulateScrollPosition('near viewport');
 * triggerEditorCommand({type: 'HIGHLIGHT'});
 * simulateStorylineMode('background');
 */
export function renderInContentElement(ui, {inlineEditing,
                                            phonePlatform = false,
                                            wrapper: OriginalWrapper,
                                            consentState = 'accepted',
                                            seed,
                                            ...options} = {}) {
  const emitter = Object.assign({}, BackboneEvents);
  const storylineEmitter = Object.assign({}, BackboneEvents);

  const inlineEditingConfig = resolveInlineEditing(inlineEditing);

  function Wrapper({children}) {
    const [storylineMode, setStorylineMode] = useState('active');

    useEffect(() => {
      storylineEmitter.on('storylineMode', setStorylineMode);
      return () => storylineEmitter.off('storylineMode', setStorylineMode);
    }, []);

    let tree = OriginalWrapper ? <OriginalWrapper children={children} /> : children;

    if (inlineEditingConfig) {
      tree = (
        <DndProvider backend={HTML5Backend}>
          <ContentElementEditorCommandEmitterContext.Provider value={emitter}>
            <ContentElementEditorStateContext.Provider value={inlineEditingConfig}>
              {tree}
            </ContentElementEditorStateContext.Provider>
          </ContentElementEditorCommandEmitterContext.Provider>
        </DndProvider>
      );
    }

    return (
      <MainStorylineActivity activeExcursion={storylineMode !== 'active' ? {id: 1} : null}>
        <ContentElementAttributesProvider id={42}>
          {tree}
        </ContentElementAttributesProvider>
      </MainStorylineActivity>
    );
  }

  return {
    ...renderInEntryWithScrollPositionLifecycle(
      ui,
      {
        lifecycleContext: ContentElementLifecycleContext,
        wrapper: Wrapper,
        consent: createConsent(consentState),
        phonePlatform,
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
    },
    simulateStorylineMode(mode) {
      act(() => {
        storylineEmitter.trigger('storylineMode', mode)
      });
    }
  };
}

function resolveInlineEditing(option) {
  if (!option) return null;

  const overrides = option === true ? {} : option;

  return {
    isEditable: overrides.isEditable ?? true,
    isSelected: overrides.isSelected ?? false,
    setTransientState: overrides.transientState ?? (() => {}),
    select: () => {},
    selectNewThread: () => {}
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
