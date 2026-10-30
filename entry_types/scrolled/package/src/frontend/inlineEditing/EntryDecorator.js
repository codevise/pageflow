import React, {useEffect, useCallback, useState} from 'react';

import {
  ReviewStateProvider,
  LocatedCommentThreadsProvider,
  CommentDisplayFilterProvider
} from 'pageflow-scrolled/review';
import {useEntryStateDispatch} from 'pageflow-scrolled/entryState';
import {usePostMessageListener} from '../../shared/usePostMessageListener';
import {EditorStateProvider, useEditorSelection, useSelectionMode} from './EditorState';
import {watchSelectionModifier} from './multiSelection';
import {
  useContentElementEditorCommandEmitter,
  ContentElementEditorCommandSubscriptionProvider
} from './ContentElementEditorCommandSubscriptionProvider';

export function EntryDecorator({commentingInitialState, children}) {
  const contentElementEditorCommandEmitter = useContentElementEditorCommandEmitter();

  useEffect(() => watchSelectionModifier(window), []);

  return (
    <EditorStateProvider>
      <ReviewStateProvider initialState={commentingInitialState}>
        <MessageHandler contentElementEditorCommandEmitter={contentElementEditorCommandEmitter} />
        <SelectionModeHandler />
        <LocatedCommentThreadsProvider>
          <CommentDisplayFilterFromEditor>
            <ContentElementEditorCommandSubscriptionProvider emitter={contentElementEditorCommandEmitter}>
              {children}
            </ContentElementEditorCommandSubscriptionProvider>
          </CommentDisplayFilterFromEditor>
        </LocatedCommentThreadsProvider>
      </ReviewStateProvider>
    </EditorStateProvider>
  );
}

// The reviewer picks which resolutions to see in the editor's sidebar
// menu, so the preview only follows what the editor tells it.
function CommentDisplayFilterFromEditor({children}) {
  const [filter, setFilter] = useState(
    {resolution: 'unresolved', alwaysShowComments: true}
  );

  usePostMessageListener(useCallback(data => {
    if (data.type === 'CHANGE_COMMENT_DISPLAY_FILTER') {
      setFilter(data.payload);
    }
  }, []));

  return (
    <CommentDisplayFilterProvider resolution={filter.resolution}
                                  alwaysShowComments={filter.alwaysShowComments}>
      {children}
    </CommentDisplayFilterProvider>
  );
}

function SelectionModeHandler() {
  const {active, end} = useSelectionMode();

  useEffect(() => {
    if (!active) {
      return;
    }

    const root = document.documentElement;

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        end();
      }
    }

    root.setAttribute('data-selection-mode', '');
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      root.removeAttribute('data-selection-mode');
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [active, end]);

  return null;
}

function MessageHandler({contentElementEditorCommandEmitter}) {
  const {select} = useEditorSelection()
  const {end: endSelectionMode} = useSelectionMode();
  const dispatch = useEntryStateDispatch();

  const receiveMessage = useCallback(data => {
    if (data.type === 'ACTION') {
      dispatch(data.payload);
    }
    else if (data.type === 'SELECT') {
      select(data.payload);
    }
    else if (data.type === 'END_SELECTION_MODE') {
      endSelectionMode();
    }
    else if (data.type === 'CONTENT_ELEMENT_EDITOR_COMMAND') {
      contentElementEditorCommandEmitter.trigger(`command:${data.payload.contentElementId}`,
                                                 data.payload.command);
    }
  }, [dispatch, select, endSelectionMode, contentElementEditorCommandEmitter]);

  usePostMessageListener(receiveMessage);

  useEffect(() => {
    if (window.parent !== window) {
      window.parent.postMessage({type: 'READY'}, window.location.origin);
    }
  }, []);

  return null;
}
