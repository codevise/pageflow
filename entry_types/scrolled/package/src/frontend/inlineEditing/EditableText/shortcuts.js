import {useCallback} from 'react';
import {toggleMark} from './marks';

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
    else if (event.key === 'b') {
      event.preventDefault()
      toggleMark(editor, 'bold');
    }
    else if (event.key === 'i') {
      event.preventDefault()
      toggleMark(editor, 'italic');
    }
    else if (event.key === 'u') {
      event.preventDefault()
      toggleMark(editor, 'underline');
    }
    else if (event.key === 'S') {
      event.preventDefault()
      toggleMark(editor, 'strikethrough');
    }
    else if (event.key === ',') {
      event.preventDefault()
      toggleMark(editor, 'sup');
    }
    else if (event.key === ';') {
      event.preventDefault()
      toggleMark(editor, 'sub');
    }
  }, [editor]);
}
