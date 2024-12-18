import {Editor, Node, Path, Range, Transforms} from 'slate';

import {Cell} from './helpers';

export function handleTableNavigation(editor, event) {
  const {selection} = editor;

  if (selection && Range.isCollapsed(selection)) {
    const cellMatch = Cell.match(editor);

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
