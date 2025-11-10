import React, {createContext, useContext, useMemo} from 'react';

import {useEditorSelection} from './EditorState';

const WidgetEditorStateContext = createContext({});

export function useWidgetEditorState() {
  return useContext(WidgetEditorStateContext);
}

export function SelectableWidgetDecorator({role, props, children}) {
  const {isSelected, select} = useEditorSelection(
    useMemo(() => ({id: role, type: 'widget'}), [role])
  );

  const value = useMemo(() => ({
    isSelected,
    select
  }), [isSelected, select]);

  return (
    <WidgetEditorStateContext.Provider value={value}>
      {children}
    </WidgetEditorStateContext.Provider>
  );
}
