import {Batch} from './Batch';
import {maybeMergeWithAdjacent} from './maybeMergeWithAdjacent';
import {ContentElement} from '../ContentElement';

// Insert content element before, after or at a split of a sibling
// element (e.g. between two paragraphs of a text block).
export function insertContentElement(entry, sibling, attributes, {at, splitPoint}) {
  const batch = new Batch(entry, sibling.section);

  if (at === 'split') {
    batch.split(sibling, splitPoint, {insertAt: 'after'});
  }

  let contentElement = new ContentElement(attributes);
  contentElement.applyDefaultConfiguration(sibling);

  if (at === 'before') {
    batch.insertBefore(sibling, contentElement);
  }
  else {
    batch.insertAfter(sibling, contentElement);
  }

  let targetRange;

  [contentElement, targetRange] = maybeMergeWithAdjacent(
    batch,
    contentElement
  );

  batch.save({
    success() {
      entry.trigger('selectContentElement', contentElement, {
        range: targetRange
      });
    }
  });

  return contentElement;
}
