import {useCallback} from 'react';

import {hasSelectionModifier} from '../multiSelection';
import {useContentElementEditorState} from '../../useContentElementEditorState';

export function useMultiSelectHandler() {
  const {extendSelection} = useContentElementEditorState();

  return useCallback(event => {
    if (!hasSelectionModifier(event)) {
      return;
    }

    // Without this, the cursor would be placed in the text and typing
    // would edit a content element that is part of a multi selection.
    event.preventDefault();
    extendSelection();
  }, [extendSelection]);
}
