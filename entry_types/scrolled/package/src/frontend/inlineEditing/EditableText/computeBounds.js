import {Range, Path} from 'slate';

export function computeBounds(editor) {
  if (!editor.selection) {
    return [0, 0];
  }

  const startPoint = Range.start(editor.selection);
  const endPoint = Range.end(editor.selection);

  const startPath = startPoint.path.slice(0, 1);
  let endPath = endPoint.path.slice(0, 1);

  if (!Path.equals(startPath, endPath) && endPoint.offset === 0) {
    endPath = Path.previous(endPath);
  }

  return [startPath[0], endPath[0]];
}
