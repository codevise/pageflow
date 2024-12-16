import {Editor, Node, Path, Point, Range, Transforms} from 'slate';

export function withFixedColumns(editor) {
  const {insertBreak, deleteBackward, deleteForward, deleteFragment} = editor;

  editor.insertBreak = () => {
    const cellMatch = matchCell(editor);

    if (cellMatch) {
      const [cellNode, cellPath] = cellMatch;

      const [rowMatch] = Editor.nodes(editor, {
        match: (n) => n.type === 'row',
      });

      if (rowMatch) {
        const [, rowPath] = rowMatch;

        const columnIndex = cellPath[cellPath.length - 1];

        const cursorOffset = editor.selection.anchor.offset;
        const text = Node.string(cellNode);
        const beforeText = text.slice(0, cursorOffset);
        const afterText = text.slice(cursorOffset);

        const newRowPath = Path.next(rowPath);

        if (columnIndex === 0) {
          Transforms.insertText(editor, afterText, {at: cellPath });

          const newRow = {
            type: 'row',
            children: [
              { type: 'label', children: [{text: beforeText}] },
              { type: 'value', children: [{text: ''}]}
            ]
          };

          Transforms.insertNodes(editor, newRow, { at: rowPath});
        }
        else {
          Transforms.insertText(editor, beforeText, { at: cellPath });

          const newRow = {
            type: 'row',
            children: [
              { type: 'label', children: [{text: ''}] },
              { type: 'value', children: [{text: afterText}]}
            ]
          };

          Transforms.insertNodes(editor, newRow, { at: newRowPath });
        }

        const cursor = {
          path: [...newRowPath, afterText.length ? columnIndex : 0, 0],
          offset: 0
        };

        Transforms.select(editor, {
          anchor: cursor,
          focus: cursor,
        });

        return;
      }
    };

    insertBreak();
  };

  editor.deleteBackward = function() {
    const {selection} = editor;

    if (selection && Range.isCollapsed(selection)) {
      const cellMatch = matchCell(editor);

      if (cellMatch) {
        const [, cellPath] = cellMatch;
        const start = Editor.start(editor, cellPath);

        if (Point.equals(selection.anchor, start)) {
          const columnIndex = cellPath[cellPath.length - 1];

          if (columnIndex === 0) {
            const rowMatch = matchCurrentRow(editor);
            const previousRowMatch = matchPreviousRow(editor);

            if (previousRowMatch) {
              const [row, rowPath] = rowMatch;
              const [previousRow, previousRowPath] = previousRowMatch;

              if (Node.string(previousRow) === '') {
                Transforms.delete(editor, {at: previousRowPath});
              }
              else if (Node.string(row) === '') {
                Transforms.delete(editor, {at: rowPath});
              }
              else {
                Transforms.select(editor, Editor.end(editor, previousRowPath));
              }
            }
          }
          else {
            Transforms.select(editor, Editor.end(editor, Path.previous(cellPath)));
          }

          return;
        }
      }
    }

    deleteBackward.apply(this, arguments);
  };

  editor.deleteForward = () => {
    const {selection} = editor;

    if (selection && Range.isCollapsed(selection)) {
      const cellMatch = matchCell(editor);

      if (cellMatch) {
        const [, cellPath] = cellMatch;
        const columnIndex = cellPath[cellPath.length - 1];

        if (Point.equals(selection.anchor, Editor.end(editor, cellPath))) {
          if (columnIndex === 0) {
            const rowMatch = matchCurrentRow(editor);

            if (rowMatch) {
              const [row, rowPath] = rowMatch;

              if (Node.string(row) === '') {
                const previousRowMatch = matchPreviousRow(editor);
                const nextRowMatch = matchNextRow(editor);

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
                Transforms.select(editor, Editor.start(editor, Path.next(cellPath)));
              }

              return;
            }
          }

          if (columnIndex === 1) {
            const nextRowMatch = matchNextRow(editor);

            if (nextRowMatch) {
              const [nextRow, nextRowPath] = nextRowMatch;

              if (Node.string(nextRow) === '') {
                Transforms.delete(editor, {at: nextRowPath});
              }
              else {
                Transforms.select(editor, Editor.start(editor, nextRowPath));
              }
            }
          }

          return;
        }
      }
    }

    deleteForward();
  };

  editor.deleteFragment = () => {
    if (editor.selection && Range.isExpanded(editor.selection)) {
      const [startPoint, endPoint] = Range.edges(editor.selection);

      const startCellMatch = matchCell(editor, {at: startPoint.path});
      const endCellMatch = matchCell(editor, {at: endPoint.path});

      if (startCellMatch && endCellMatch) {
        const [, startCellPath] = startCellMatch;
        const [, endCellPath] = endCellMatch;

        if (!Path.equals(startCellPath, endCellPath)) {
          const rewrittenCellPath = getRewrittenCellPath(startCellPath, endCellPath);

          const rows = Array.from(Editor.nodes(editor, {
            match: (n) => n.type === 'row',
            at: { anchor: startPoint, focus: endPoint },
          }));

          CellTransforms.deleteContentFrom(editor, {
            cellPath: startCellPath,
            point: startPoint
          });

          if (rewrittenCellPath) {
            const startCellText =
              CellPath.columnIndex(startCellPath) === CellPath.columnIndex(endCellPath) ?
              Editor.string(editor, {
                anchor: Editor.start(editor, startCellPath),
                focus: startPoint
              }) :
              '';

            const endCellText = Editor.string(editor, {
              focus: endPoint,
              anchor: Editor.end(editor, endCellPath),
            });
            Transforms.insertText(editor, startCellText + endCellText, {at: rewrittenCellPath})
            Transforms.select(editor, {...Editor.start(editor, rewrittenCellPath), offset: startCellText.length});

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

    deleteFragment();

    function getRewrittenCellPath(startCellPath, endCellPath) {
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
  };

  return editor;
}

const CellTransforms = {
  deleteContentUntil(editor, {cellPath, point}) {
    if (!Editor.isStart(editor, point, cellPath)) {
      Transforms.delete(editor, {
        at: {
          anchor: Editor.start(editor, cellPath),
          focus: point,
        },
      });
    }
  },

  deleteContentFrom(editor, {cellPath, point}) {
    if (!Editor.isEnd(editor, point, cellPath)) {
      Transforms.delete(editor, {
        at: {
          anchor: point,
          focus: Editor.end(editor, cellPath),
        },
      });
    }
  }
}

const CellPath = {
  columnIndex(path) {
    return path[path.length - 1];
  },

  rowIndex(path) {
    return path[path.length - 2];
  }
}

export function handleTableNavigation(editor, event) {
  const {selection} = editor;

  if (selection && Range.isCollapsed(selection)) {
    const cellMatch = matchCell(editor);

    if (cellMatch) {
      const [, cellPath] = cellMatch;
      const rowPath = cellPath.slice(0, -1);

      if (event.key === 'ArrowUp') {
        event.preventDefault();

        if (rowPath[rowPath.length - 1] > 0) {
          const previousRowPath = Path.previous(rowPath);
          const targetPath = [...previousRowPath, cellPath[cellPath.length - 1]];

          Transforms.select(editor, Editor.start(editor, targetPath));
        }
      } else if (event.key === 'ArrowDown') {
        event.preventDefault();

        const nextRowPath = Path.next(rowPath);
        const targetPath = [...nextRowPath, cellPath[cellPath.length - 1]];

        if (Node.has(editor, targetPath)) {
          Transforms.select(editor, Editor.start(editor, targetPath));
        }
      }
    }
  }
}

function matchCell(editor, {at} = {}) {
  const [cellMatch] = Editor.nodes(editor, {
    match: n => n.type === 'label' || n.type === 'value',
    at
  });

  return cellMatch;
}

function matchCurrentRow(editor) {
  const [rowMatch] = Editor.nodes(editor, {
    match: (n) => n.type === 'row',
  });

  return rowMatch;
}

function matchPreviousRow(editor) {
  const rowMatch = matchCurrentRow(editor);

  if (rowMatch) {
    const [, rowPath] = rowMatch;
    return Editor.previous(editor, {at: rowPath});
  }
}

function matchNextRow(editor) {
  const rowMatch = matchCurrentRow(editor);

  if (rowMatch) {
    const [, rowPath] = rowMatch;
    return Editor.next(editor, {at: rowPath});
  }
}
