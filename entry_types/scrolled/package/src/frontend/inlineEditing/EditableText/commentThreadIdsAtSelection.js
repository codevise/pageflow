import {highlightOverlapsSelection} from './highlightOverlapsSelection';

export function commentThreadIdsAtSelection(highlights, selection) {
  if (!selection) return [];

  return highlights
    .filter(h => h.thread && highlightOverlapsSelection(h, selection))
    .map(h => h.thread.id);
}
