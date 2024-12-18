import {Editor} from 'slate';

export const Row = {
  match(editor) {
    const [rowMatch] = Editor.nodes(editor, {
      match: (n) => n.type === 'row',
    });

    return rowMatch;
  }
}

export const Cell = {
  splitChildren(editor, {cellNode, point}) {
    const [leafNode, leafPath] = Editor.leaf(editor, point.path);

    const cursorOffset = point.offset;
    const text = leafNode.text || '';
    const beforeText = text.slice(0, cursorOffset);
    const afterText = text.slice(cursorOffset);

    const splitIndex = leafPath[leafPath.length - 1];

    const beforeNodes = [];
    const afterNodes = [];

    cellNode.children.forEach((node, index) => {
      if (index < splitIndex) {
        beforeNodes.push(node);
      } else if (index === splitIndex) {
        if (beforeText) {
          beforeNodes.push({ ...node, text: beforeText });
        }
        if (afterText) {
          afterNodes.push({ ...node, text: afterText });
        }
      } else {
        afterNodes.push(node);
      }
    });

    return [beforeNodes, afterNodes];
  },

  match(editor, {at} = {}) {
    const [cellMatch] = Editor.nodes(editor, {
      match: n => n.type === 'label' || n.type === 'value',
      at
    });

    return cellMatch;
  }
}

export const CellPath = {
  columnIndex(path) {
    return path[path.length - 1];
  },

  rowIndex(path) {
    return path[path.length - 2];
  }
};
