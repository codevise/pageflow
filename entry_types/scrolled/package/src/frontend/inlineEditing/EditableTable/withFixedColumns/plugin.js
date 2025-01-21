import {Editor, Node, Path, Range, Transforms} from 'slate';

import {Cell, CellPath, Row} from './helpers';
import {TableTransforms, CellTransforms} from './transforms';

export function withFixedColumns(editor) {
  const {deleteBackward, deleteForward, deleteFragment} = editor;

  editor.insertBreak = () => {
    const cellMatch = Cell.match(editor);

    if (!cellMatch) {
      return;
    }

    const [cellNode, cellPath] = cellMatch;
    const rowPath = Path.parent(cellPath);

    const columnIndex = CellPath.columnIndex(cellPath);
    const newRowPath = Path.next(rowPath);

    const [beforeNodes, afterNodes] = Cell.splitChildren(editor, {
      cellNode,
      point: editor.selection.anchor
    });

    if (columnIndex === 0) {
      CellTransforms.replaceContent(editor, afterNodes, {cellPath});

      const newRow = {
        type: 'row',
        children: [
          {type: 'label', children: beforeNodes},
          {type: 'value', children: [{text: ''}]},
        ],
      };

      Transforms.insertNodes(editor, newRow, {at: rowPath});
    } else {
      CellTransforms.replaceContent(editor, beforeNodes, {cellPath});

      const newRow = {
        type: 'row',
        children: [
          {type: 'label', children: [{text: ''}]},
          {type: 'value', children: afterNodes},
        ],
      };

      Transforms.insertNodes(editor, newRow, {at: newRowPath});
    }

    Transforms.select(editor, {
      path: [...newRowPath, afterNodes.length ? columnIndex : 0, 0],
      offset: 0
    });
  };

  editor.deleteBackward = function() {
    if (!editor.selection || !Range.isCollapsed(editor.selection)) {
      return;
    }

    const cellMatch = Cell.match(editor);

    if (!cellMatch) {
      return;
    }

    const [, cellPath] = cellMatch;

    if (!Editor.isStart(editor, editor.selection.anchor, cellPath)) {
      deleteBackward.apply(this, arguments);
      return;
    }

    const [row, rowPath] = Editor.parent(editor, cellPath);
    const previousRowMatch = Editor.previous(editor, {at: rowPath});

    if (CellPath.columnIndex(cellPath) === 0) {
      if (previousRowMatch) {
        const [previousRow, previousRowPath] = previousRowMatch;

        if (Node.string(previousRow) === '') {
          Transforms.delete(editor, {at: previousRowPath});
        }
        else if (Node.string(row) === '') {
          Transforms.delete(editor, {at: rowPath});
        }
        else if (Node.string(Node.child(previousRow, 1)) === '') {
          TableTransforms.deleteRange(editor, [
            Editor.end(editor, [...previousRowPath, 0]),
            editor.selection.anchor
          ]);
        }
        else {
          Transforms.select(editor, Editor.end(editor, previousRowPath));
        }
      }
    }
    else {
      if (previousRowMatch) {
        const [, previousRowPath] = previousRowMatch;

        if (Node.string(Node.child(row, 0)) === '') {
          TableTransforms.deleteRange(editor, [
            Editor.end(editor, previousRowPath),
            editor.selection.anchor
          ]);
          return;
        }
      }

      Transforms.select(editor, Editor.end(editor, Path.previous(cellPath)));
    }
  };

  editor.deleteForward = () => {
    if (!editor.selection || !Range.isCollapsed(editor.selection)) {
      return;
    }

    const cellMatch = Cell.match(editor);

    if (!cellMatch) {
      return;
    }

    const [, cellPath] = cellMatch;

    if (!Editor.isEnd(editor, editor.selection.anchor, cellPath)) {
      deleteForward();
      return;
    }

    const columnIndex = cellPath[cellPath.length - 1];
    const [row, rowPath] = Editor.parent(editor, cellPath);
    const nextRowMatch = Editor.next(editor, {at: rowPath});

    if (columnIndex === 0) {
      if (Node.string(row) === '') {
        const previousRowMatch = Editor.previous(editor, {at: rowPath});

        if (previousRowMatch || nextRowMatch) {
          Transforms.delete(editor, {at: rowPath});

          if (Node.has(editor, rowPath)) {
            Transforms.select(editor, Editor.start(editor, rowPath));
          }
          else {
            const [, previousRowPath] = previousRowMatch;
            Transforms.select(editor, Editor.start(editor, previousRowPath));
          }
        }
      }
      else {
        if (nextRowMatch) {
          const [, nextRowPath] = nextRowMatch;

          if (Node.string(Node.child(row, 1)) === '') {
            TableTransforms.deleteRange(editor, [
              editor.selection.anchor,
              Editor.start(editor, nextRowPath)
            ]);
            return;
          }
        }

        Transforms.select(editor, Editor.start(editor, Path.next(cellPath)));
      }
    }
    else {
      if (nextRowMatch) {
        const [nextRow, nextRowPath] = nextRowMatch;

        if (Node.string(nextRow) === '') {
          Transforms.delete(editor, {at: nextRowPath});
        }
        else if (Node.string(Node.child(nextRow, 0)) === '') {
          TableTransforms.deleteRange(editor, [
            editor.selection.anchor,
            Editor.start(editor, [...nextRowPath, 1])
          ]);
        }
        else {
          Transforms.select(editor, Editor.start(editor, nextRowPath));
        }
      }
    }
  };

  editor.deleteFragment = () => {
    if (editor.selection && Range.isExpanded(editor.selection)) {
      if (TableTransforms.deleteRange(editor, Range.edges(editor.selection))) {
        return;
      }
    }

    deleteFragment();
  };

  editor.insertData = function(data) {
    const fragment = data.getData('application/x-slate-fragment')

    if (fragment) {
      const decoded = decodeURIComponent(window.atob(fragment))
      const parsed = JSON.parse(decoded);

      if (parsed.every(element => element['type'] === 'row')) {
        editor.insertFragment(parsed);
        return
      }
    }

    const text = data.getData('text/plain');

    if (text) {
      editor.insertText(text);
    }
  };

  editor.insertFragment = function(fragment) {
    if (fragment.length === 1 &&
        fragment[0].children.length === 1) {
      Transforms.insertFragment(editor, fragment[0].children[0].children);
    }
    else {
      const rowMatch = Row.match(editor);

      if (rowMatch) {
        ensureLabelAndValueCells(fragment)

        const [, rowPath] = rowMatch;
        const nextRowPath = Path.next(rowPath);
        const pathRef = Editor.pathRef(editor, nextRowPath);

        Transforms.insertNodes(editor, fragment, {
          at: nextRowPath
        });

        Transforms.select(editor, Editor.end(editor, Path.previous(pathRef.unref())));
      }
    }

    function ensureLabelAndValueCells(fragment) {
      if (fragment[0].children.length === 1) {
        fragment[0].children.unshift({type: 'label', children: [{text: ''}]});
      }

      if (fragment[fragment.length - 1].children.length === 1) {
        fragment[fragment.length - 1].children.push({type: 'value', children: [{text: ''}]});
      }
    }
  };

  return editor;
}
