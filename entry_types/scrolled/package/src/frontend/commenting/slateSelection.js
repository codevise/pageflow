import {ReactEditor} from 'slate-react';

export const slateSelection = {
  inEditor(editor) {
    const domSelection = window.getSelection();

    if (!domSelection ||
        !domSelection.anchorNode ||
        !domSelection.focusNode ||
        domSelection.isCollapsed) return null;

    if (!ReactEditor.hasDOMNode(editor, domSelection.anchorNode) ||
        !ReactEditor.hasDOMNode(editor, domSelection.focusNode)) return null;

    try {
      return ReactEditor.toSlateRange(editor, domSelection);
    }
    catch (e) {
      return null;
    }
  }
};
