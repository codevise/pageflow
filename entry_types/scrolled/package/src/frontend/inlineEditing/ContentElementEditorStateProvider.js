import React, {useMemo, useCallback, useRef} from 'react';

import {ContentElementEditorStateContext} from '../useContentElementEditorState';
import {useEditorSelection} from './EditorState';
import {postUpdateTransientContentElementStateMessage} from './postMessage';

export function ContentElementEditorStateProvider({id, children}) {
  const {isSelected, select} = useEditorSelection({id, type: 'contentElement'});

  const previousTransientState = useRef({});
  const setTransientState = useCallback(state => {
    if (!shallowEqual(state, previousTransientState.current)) {
      postUpdateTransientContentElementStateMessage({id, state});
      previousTransientState.current = state;
    }
  }, [id]);

  const value = useMemo(() => ({
    isEditable: true,
    select,
    isSelected,
    setTransientState
  }), [select, isSelected, setTransientState]);

  return (
    <ContentElementEditorStateContext.Provider value={value}>
      {children}
    </ContentElementEditorStateContext.Provider>
  )
}
function shallowEqual(obj1, obj2) {
  return Object.keys(obj1).length === Object.keys(obj2).length &&
         Object.keys(obj1).every(key =>
           Object.prototype.hasOwnProperty.call(obj2, key) && obj1[key] === obj2[key]
         );
}
