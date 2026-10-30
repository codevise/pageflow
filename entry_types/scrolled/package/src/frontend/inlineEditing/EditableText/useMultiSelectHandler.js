import {useCallback} from 'react';

import {useContentElementEditorState} from '../../useContentElementEditorState';
import {useSelectionMode} from '../EditorState';

export function useMultiSelectHandler() {
  const {extendSelection} = useContentElementEditorState();
  const selectionMode = useSelectionMode();

  return useCallback(event => {
    if (!selectionMode.extendsSelection(event)) {
      return;
    }

    // Without this, the cursor would be placed in the text and typing
    // would edit a content element that is part of a multi selection.
    event.preventDefault();
    extendSelection();
  }, [extendSelection, selectionMode]);
}
