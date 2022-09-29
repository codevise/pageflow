import React, {useCallback} from 'react';

import {decorateCharacter, deleteCharacter, shy} from './characters';

import styles from './index.module.css';

export function useLineBreakHandler(editor) {
  return useCallback((event) => {
    if (event.key !== 'Enter') {
      return;
    }

    if (event.altKey === true) {
      editor.insertText(shy);
      event.preventDefault();
    }
    else if (event.shiftKey === true) {
      editor.insertText('\n');
      event.preventDefault();
    }
  }, [editor]);
}

export function decorateLineBreaks(nodeEntry) {
  return decorateCharacter(nodeEntry, shy, {shy: true}, {length: 1});
}

export function wrapLeafWithLineBreakDecoration({leaf, children, attributes}) {
  if (leaf.shy) {
    children = <span className={styles.shy}>{children}</span>;
  }

  return {leaf, children, attributes};
}

export function withLineBreakNormalization(editor) {
  const { normalizeNode } = editor;

  editor.normalizeNode = ([node, path]) => {
    if (node.text) {
      if (deleteCharacter(editor, node, path, new RegExp(`${shy}\\s`)) ||
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
