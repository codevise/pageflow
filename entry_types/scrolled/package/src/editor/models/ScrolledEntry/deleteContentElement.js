import {Batch} from './Batch';

// Delete element and merge its adjacent siblings if possible
// (e.g. two text blocks surrounding a deleted image).
export function deleteContentElement(entry, contentElement) {
  const batch = new Batch(entry, contentElement.section);

  const [before, after] = batch.getAdjacent(contentElement);

  batch.remove(contentElement);
  batch.markForDeletion(contentElement);
  batch.maybeMerge(before, after);

  batch.save();
}
