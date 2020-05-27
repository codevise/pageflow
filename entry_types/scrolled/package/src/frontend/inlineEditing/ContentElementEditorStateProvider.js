import React, {useMemo} from 'react';

import {ContentElementEditorStateContext} from '../useContentElementEditorState';
import {useEditorSelection} from './EditorState';

export function ContentElementEditorStateProvider({id, children}) {
  const {isSelected, select} = useEditorSelection({id, type: 'contentElement'});

  const value = useMemo(() => ({isEditable: true, select, isSelected}),
                        [select, isSelected]);

  return (
    <ContentElementEditorStateContext.Provider value={value}>
      {children}
    </ContentElementEditorStateContext.Provider>
  )
}
