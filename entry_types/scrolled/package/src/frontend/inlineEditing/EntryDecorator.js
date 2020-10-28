import React, {useEffect, useCallback} from 'react';
import {DndProvider} from 'react-dnd';
import {HTML5Backend} from 'react-dnd-html5-backend';

import {useEntryStateDispatch} from '../../entryState';
import {usePostMessageListener} from '../usePostMessageListener';
import {EditorStateProvider, useEditorSelection} from './EditorState';
import {
  useContentElementEditorCommandEmitter,
  ContentElementEditorCommandSubscriptionProvider
} from './ContentElementEditorCommandSubscriptionProvider';
import {ScrollPointMessageHandler} from './scrollPoints';

export function EntryDecorator(props) {
  const contentElementEditorCommandEmitter = useContentElementEditorCommandEmitter();

  return (
    <EditorStateProvider>
      <MessageHandler contentElementEditorCommandEmitter={contentElementEditorCommandEmitter} />
      <ScrollPointMessageHandler />
      <ContentElementEditorCommandSubscriptionProvider emitter={contentElementEditorCommandEmitter}>
        <DndProvider backend={HTML5Backend}>
          {props.children}
        </DndProvider>
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
