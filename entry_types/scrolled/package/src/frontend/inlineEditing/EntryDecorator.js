import React from 'react';

import {EditorStateProvider} from './EditorState';

export function EntryDecorator({children}) {
  return (
    <EditorStateProvider>
      {children}
    </EditorStateProvider>
  );
}
