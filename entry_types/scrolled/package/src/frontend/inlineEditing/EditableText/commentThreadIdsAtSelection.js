import {rangeOverlapsSelection} from './rangeOverlapsSelection';

export function commentThreadIdsAtSelection(highlights, selection) {
  if (!selection) return [];

  return highlights
    .filter(h => h.thread && rangeOverlapsSelection(h.range, selection))
    .map(h => h.thread.id);
}
