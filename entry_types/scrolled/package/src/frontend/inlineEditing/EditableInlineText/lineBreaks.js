import {Text, Transforms} from 'slate';
import {useCallback} from 'react';

const shy = '\u00AD';

export function useLineBreakHandler(editor) {
  return useCallback((event) => {
    if (event.key !== 'Enter') {
      return true;
    }

    if (event.shiftKey === true) {
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

function decorateCharacter([node, path], character, attributes, {length}) {
  if (Text.isText(node)) {
    const parts = node.text.split(character);
    parts.pop();

    let i = 0;

    return parts.map(part => {
      i += part.length + 1;

      return {
        anchor: {path, offset: i - 1},
        focus: {path, offset: i - 1 + length},
        ...attributes
      };
    });
  }

  return [];
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

function deleteCharacter(editor, node, path, regExp, offset = 0) {
  const match = regExp.exec(node.text);

  if (match) {
    Transforms.delete(editor, {
      at: {path, offset: match.index + offset},
      distance: 1,
      unit: 'character'
    });

    return true;
  }

  return false
}
