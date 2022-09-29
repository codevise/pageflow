import {Transforms} from 'slate';
import {useCallback} from 'react';

import {shy, decorateCharacter, deleteCharacter} from '../EditableText/characters';

export function useLineBreakHandler(editor) {
  return useCallback((event) => {
    if (event.key !== 'Enter') {
      return true;
    }

    // Soft hyphens used to be inserted with Shift + Enter.
    // Since Shift + Enter is now used for soft breaks in text blocks,
    // we switched to Alt + Enter. Since all line breaks in
    // EdtiableInlineText are soft, we also keep the old short cut
    if (event.shiftKey === true || event.altKey === true) {
      editor.insertText(shy);
    }
    else {
      editor.insertText('\n');
    }

    return false;
  }, [editor]);
}

export function decorateLineBreaks(nodeEntry) {
  return [
    ...decorateCharacter(nodeEntry, shy, {shy: true}, {length: 1}),
    ...decorateCharacter(nodeEntry, "\n", {newLine: true}, {length: 0})
  ]
}

export function withLineBreakNormalization(editor) {
  const { normalizeNode } = editor;

  editor.normalizeNode = ([node, path]) => {
    if (path.length === 0 && editor.children.length > 1) {
      Transforms.mergeNodes(editor);
      return;
    }
    else if (node.text) {
      if (deleteCharacter(editor, node, path, /\n\n/) ||
          deleteCharacter(editor, node, path, new RegExp(`^\n`)) ||
          deleteCharacter(editor, node, path, new RegExp(`${shy}\\s`)) ||
          deleteCharacter(editor, node, path, new RegExp(`^${shy}`)) ||
          deleteCharacter(editor, node, path, new RegExp(`\\s${shy}`), 1) ||
          deleteCharacter(editor, node, path, new RegExp(`${shy}${shy}`))) {
        return;
      }
    }

    return normalizeNode([node, path]);
  };

  return editor;
}
