import {Editor, Path, Transforms} from 'slate';

import {Cell, CellPath} from '../helpers';
import {CellTransforms} from './cell';

export const TableTransforms = {
  deleteRange(editor, [startPoint, endPoint]) {
    const startCellMatch = Cell.match(editor, {at: startPoint.path});
    const endCellMatch = Cell.match(editor, {at: endPoint.path});

    if (startCellMatch && endCellMatch) {
      const [startCellNode, startCellPath] = startCellMatch;
      const [endCellNode, endCellPath] = endCellMatch;

      if (!Path.equals(startCellPath, endCellPath)) {
        const rewrittenCellPath = getRewrittenCellPath(editor, startCellPath, endCellPath);

        const rows = Array.from(Editor.nodes(editor, {
          match: (n) => n.type === 'row',
          at: { anchor: startPoint, focus: endPoint },
        }));

        CellTransforms.deleteContentFrom(editor, {
          cellPath: startCellPath,
          point: startPoint
        });

        if (rewrittenCellPath) {
          const beforeNodes =
            CellPath.columnIndex(startCellPath) === CellPath.columnIndex(endCellPath) ?
            Cell.splitChildren(editor, {
              cellNode: startCellNode,
              point: startPoint
            })[0] :
            [];

          const [, afterNodes] = Cell.splitChildren(editor, {
            cellNode: endCellNode,
            point: endPoint
          });
          CellTransforms.replaceContent(editor, beforeNodes.concat(afterNodes), {
            cellPath: rewrittenCellPath
          })
          Transforms.select(editor, {
            ...Editor.start(editor, rewrittenCellPath),
            offset: beforeNodes[beforeNodes.length - 1]?.text.length || 0
          });

          rows.reverse().forEach(([_, rowPath]) => {
            if (rowPath[rowPath.length - 1] !== CellPath.rowIndex(rewrittenCellPath)) {
              Transforms.removeNodes(editor, {at: rowPath});
            }
          });
        }
        else {
          CellTransforms.deleteContentUntil(editor, {
            cellPath: endCellPath,
            point: endPoint
          });

          rows.slice(1, -1).reverse().forEach(([_, rowPath]) => {
            Transforms.removeNodes(editor, {at: rowPath});
          });

          Transforms.select(editor, startPoint);
        }

        return;
      }
    }
  }
};

function getRewrittenCellPath(editor, startCellPath, endCellPath) {
  if (CellPath.columnIndex(startCellPath) < CellPath.columnIndex(endCellPath)) {
    const [, rewrittenCellPath] = Editor.next(editor, {at: startCellPath});
    return rewrittenCellPath;
  }
  else if (CellPath.columnIndex(startCellPath) > CellPath.columnIndex(endCellPath)) {
    return null;
  }
  else if (CellPath.columnIndex(startCellPath) === 0) {
    return endCellPath;
  }
  else {
    return startCellPath;
  }
}
