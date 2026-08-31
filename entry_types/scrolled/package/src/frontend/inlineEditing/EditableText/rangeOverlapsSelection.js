import {Range} from 'slate';

export function rangeOverlapsSelection(range, selection) {
  if (!range || !selection) return false;

  const selStart = Range.start(selection);
  const selEnd = Range.end(selection);
  const selStartBlock = selStart.path[0];
  let selEndBlock = selEnd.path[0];

  if (selEndBlock !== selStartBlock && selEnd.offset === 0) {
    selEndBlock -= 1;
  }

  const startBlock = Range.start(range).path[0];

  return selStartBlock <= startBlock && startBlock <= selEndBlock;
}
