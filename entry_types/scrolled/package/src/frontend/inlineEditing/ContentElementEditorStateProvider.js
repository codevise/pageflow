import React, {useMemo, useCallback, useRef} from 'react';

import {ContentElementEditorStateContext} from '../useContentElementEditorState';
import {useEditorSelection} from './EditorState';
import {postUpdateTransientContentElementStateMessage} from './postMessage';
import {useStorylineActivity} from '../storylineActivity';

export function ContentElementEditorStateProvider({id, children}) {
  const {isSelected, select, range} = useEditorSelection(
    useMemo(() => ({id, type: 'contentElement'}), [id])
  );
  const {isSelected: commentsSelected, select: selectComments} = useEditorSelection(
    useMemo(() => ({id, type: 'contentElementComments'}), [id])
  );

  const storylineMode = useStorylineActivity();
  const isSelectedInForeground = (isSelected || commentsSelected) && storylineMode === 'active';

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
    selectComments,
    isSelected: isSelectedInForeground,
    commentsSelected,
    range,
    setTransientState
  }), [select, selectComments, isSelectedInForeground, commentsSelected, range, setTransientState]);

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
