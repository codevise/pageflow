import React, {useEffect, useCallback} from 'react';

import {useEntryStateDispatch} from '../../entryState';
import {usePostMessageListener} from '../usePostMessageListener';
import {EditorStateProvider, useEditorSelection} from './EditorState';

export function EntryDecorator(props) {
  return (
    <EditorStateProvider>
      <MessageHandler />
      {props.children}
    </EditorStateProvider>
  );
}

function MessageHandler() {
  const {select} = useEditorSelection()
  const dispatch = useEntryStateDispatch();

  const receiveMessage = useCallback(data => {
    if (data.type === 'ACTION') {
      dispatch(data.payload);
    }
    else if (data.type === 'SELECT') {
      select(data.payload);
    }
  }, [dispatch, select]);

  usePostMessageListener(receiveMessage);

  useEffect(() => {
    if (window.parent !== window) {
      window.parent.postMessage({type: 'READY'}, window.location.origin);
    }
  }, []);

  return null;
}
