import React from 'react';

import {EditorStateProvider} from '../EditorState';

export function EntryDecorator(props) {
  return (
    <EditorStateProvider>
      {props.children}
    </EditorStateProvider>
  );
}
