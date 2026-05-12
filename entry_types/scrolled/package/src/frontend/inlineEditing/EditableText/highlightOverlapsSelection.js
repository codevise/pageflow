import {Range} from 'slate';

export function highlightOverlapsSelection(highlight, selection) {
  if (!highlight?.range || !selection) return false;

  const selStart = Range.start(selection);
  const selEnd = Range.end(selection);
  const selStartBlock = selStart.path[0];
  let selEndBlock = selEnd.path[0];

  if (selEndBlock !== selStartBlock && selEnd.offset === 0) {
    selEndBlock -= 1;
  }

  const hlStartBlock = Range.start(highlight.range).path[0];

  return selStartBlock <= hlStartBlock && hlStartBlock <= selEndBlock;
}
