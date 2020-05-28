import React, {useEffect, useCallback} from 'react';

import {useEntryStateDispatch} from '../../entryState';
import {usePostMessageListener} from '../usePostMessageListener';
import {EditorStateProvider, useEditorSelection} from './EditorState';
import {
  useContentElementEditorCommandEmitter,
  ContentElementEditorCommandSubscriptionProvider
} from './ContentElementEditorCommandSubscriptionProvider';

export function EntryDecorator(props) {
  const contentElementEditorCommandEmitter = useContentElementEditorCommandEmitter();

  return (
    <EditorStateProvider>
      <MessageHandler contentElementEditorCommandEmitter={contentElementEditorCommandEmitter} />
      <ContentElementEditorCommandSubscriptionProvider emitter={contentElementEditorCommandEmitter}>
        {props.children}
      </ContentElementEditorCommandSubscriptionProvider>
    </EditorStateProvider>
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
