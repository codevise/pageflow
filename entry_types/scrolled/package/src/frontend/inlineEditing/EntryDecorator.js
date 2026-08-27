import React, {useEffect, useCallback, useState} from 'react';

import {
  ReviewStateProvider,
  LocatedCommentThreadsProvider,
  CommentDisplayFilterProvider
} from 'pageflow-scrolled/review';
import {useEntryStateDispatch} from 'pageflow-scrolled/entryState';
import {usePostMessageListener} from '../../shared/usePostMessageListener';
import {EditorStateProvider, useEditorSelection} from './EditorState';
import {
  useContentElementEditorCommandEmitter,
  ContentElementEditorCommandSubscriptionProvider
} from './ContentElementEditorCommandSubscriptionProvider';

export function EntryDecorator({commentingInitialState, children}) {
  const contentElementEditorCommandEmitter = useContentElementEditorCommandEmitter();

  return (
    <EditorStateProvider>
      <ReviewStateProvider initialState={commentingInitialState}>
        <MessageHandler contentElementEditorCommandEmitter={contentElementEditorCommandEmitter} />
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
  const [resolution, setResolution] = useState('unresolved');

  usePostMessageListener(useCallback(data => {
    if (data.type === 'CHANGE_COMMENT_DISPLAY_FILTER') {
      setResolution(data.payload.resolution);
    }
  }, []));

  return (
    <CommentDisplayFilterProvider resolution={resolution}>
      {children}
    </CommentDisplayFilterProvider>
  );
}

function MessageHandler({contentElementEditorCommandEmitter}) {
  const {select} = useEditorSelection()
  const dispatch = useEntryStateDispatch();

  const receiveMessage = useCallback(data => {
    if (data.type === 'ACTION') {
      dispatch(data.payload);
    }
    else if (data.type === 'SELECT') {
      select(data.payload);
    }
    else if (data.type === 'CONTENT_ELEMENT_EDITOR_COMMAND') {
      contentElementEditorCommandEmitter.trigger(`command:${data.payload.contentElementId}`,
                                                 data.payload.command);
    }
  }, [dispatch, select, contentElementEditorCommandEmitter]);

  usePostMessageListener(receiveMessage);

  useEffect(() => {
    if (window.parent !== window) {
      window.parent.postMessage({type: 'READY'}, window.location.origin);
    }
  }, []);

  return null;
}
