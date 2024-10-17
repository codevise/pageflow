import {useCallback} from 'react';

export function useShortcutHandler(editor) {
  return useCallback(event => {
    if (!event.ctrlKey) {
      return;
    }

    if (event.key === 'z') {
      event.preventDefault()
      editor.undo();
    }
    else if (event.key === 'y') {
      event.preventDefault()
      editor.redo();
    }
  }, [editor]);
}
