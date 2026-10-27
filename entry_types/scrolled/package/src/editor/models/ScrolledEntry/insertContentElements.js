import {Batch} from './Batch';
import {ContentElement} from '../ContentElement';

export function insertContentElements(entry, section, attributesList, {sibling, at, splitPoint}) {
  const batch = new Batch(entry, section, {reviewSession: entry.reviewSession});

  if (at === 'split') {
    batch.split(sibling, splitPoint, {insertAt: 'after'});
  }

  const contentElements = attributesList.map(attributes => new ContentElement(attributes));

  contentElements.reduce((previous, contentElement, index) => {
    if (index === 0 && at === 'before') {
      batch.insertBefore(sibling, contentElement);
    }
    else {
      batch.insertAfter(previous, contentElement);
    }

    return contentElement;
  }, sibling);

  const first = mergeWithAdjacent(batch, contentElements);

  return new Promise((resolve, reject) => {
    batch.save({
      success() {
        if (first) {
          entry.trigger('selectContentElement', first);
        }

        resolve();
      },

      error: reject
    });
  });
}

function mergeWithAdjacent(batch, contentElements) {
  let first = contentElements[0];
  const last = contentElements[contentElements.length - 1];

  if (!first) {
    return;
  }

  const lastSurvivor = batch.maybeMerge(last, batch.getAdjacent(last)[1]);

  if (lastSurvivor && first === last) {
    first = lastSurvivor;
  }

  return batch.maybeMerge(batch.getAdjacent(first)[0], first) || first;
}
