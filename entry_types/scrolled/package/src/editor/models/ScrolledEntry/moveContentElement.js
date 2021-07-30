import {Batch} from './Batch';

// Move content element inside section or between sections. Allow
// moving content elements to "split points" inside content elements
// with custom split functions (e.g. between two paragraphs of a text
// block). Merge content elements of the same type that become
// adjacent by moving a content element away (e.g. two text blocks
// surrounding an image that is moved away).
export function moveContentElement(entry, contentElement, {range, sibling, at, splitPoint}) {
  const sourceBatch = new Batch(entry, contentElement.section);

  // If we move content elements between sections, merges will need to
  // be performed in the section where the content element came from.
  const targetBatch = sibling.section === contentElement.section ?
                      sourceBatch :
                      new Batch(entry, sibling.section);

  if (range && !rangeCoversWholeElement(sourceBatch, contentElement, range)) {
    if (contentElement === sibling && at === 'split') {
      // If we are moving part of a content element inside the content
      // element itself, we need to adjust the split point if the
      // moved range lies above the split point since moving a range
      // means first extracting/removing it from the source element.
      const delta = (splitPoint > range[0]) ? range[1] - range[0] : 0;
      splitPoint -= delta;
    }

    contentElement = extractRange(sourceBatch, contentElement, range)
  }

  if (at === 'split') {
    // When moving a content element to a split point in the adjacent
    // element below, insert split off element before sibling so that
    // is can directly be merged again. For example, let X be a
    // content element in between two text blocks T1 and T2:
    //
    //   T1
    //     paragraph A
    //   X
    //   T2
    //     paragraph B
    //     paragraph C
    //
    // When X shall be moved between the two paragraphs of T2, we want
    // to split off the first paragraph of T2 into a new content
    // element T3 and move X:
    //
    //   T1
    //     T1 paragraph A
    //   X
    //   T3
    //     T1 paragraph B
    //   T2
    //     T2 paragraph C
    //
    // T3 becomes the new sibling that we want to move X after:
    //
    //   T1
    //     T1 paragraph A
    //   T3
    //     T1 paragraph B
    //   X
    //   T2
    //     T2 paragraph C
    //
    // When we later merge T1 and T3, T1 will be updated making T3
    // disappear again without ever persisting it to the server:
    //
    //   T1
    //     T1 paragraph A
    //     T1 paragraph B
    //   X
    //   T2
    //     T2 paragraph C
    //
    if (sourceBatch.getAdjacent(contentElement)[1] === sibling) {
      sibling = targetBatch.split(sibling, splitPoint, {insertAt: 'before'});
    }
    else {
      targetBatch.split(sibling, splitPoint);
    }
  }

  const [before, after] = sourceBatch.getAdjacent(contentElement);
  let targetRange = createRange(targetBatch, contentElement);

  // Check if element was dragged to same position where it came from.
  if (!(at === 'before' && !range && sibling === after) &&
      !(at === 'after' && !range && sibling === before)) {
    sourceBatch.remove(contentElement);

    if (at === 'before') {
      targetBatch.insertBefore(sibling, contentElement);
    }
    else {
      targetBatch.insertAfter(sibling, contentElement);
    }

    [contentElement, targetRange] = maybeMergeWithAdjacent(
      targetBatch,
      contentElement
    );

    sourceBatch.maybeMerge(before, after);
  }

  // Dragging an element next to a sticky element, shall make the
  // moved element sticky as well.
  copyPositionIfAvailable(targetBatch, contentElement, sibling);

  targetBatch.saveIfDirty({
    success() {
      entry.trigger('selectContentElement', contentElement, {
        range: targetRange
      });
    }
  });
  sourceBatch.saveIfDirty();
}

function rangeCoversWholeElement(batch, contentElement, range) {
  return range[0] === 0 && range[1] === batch.getLength(contentElement);
}

function extractRange(batch, contentElement, range) {
  const extracted = batch.split(contentElement, range[0]);
  const suffix = batch.split(extracted, range[1] - range[0]);

  batch.maybeMerge(contentElement, suffix);

  return extracted;
}

function maybeMergeWithAdjacent(batch, contentElement) {
  const [before, after] = batch.getAdjacent(contentElement);

  const range = createRange(batch, contentElement);
  const beforeLength = before ? batch.getLength(before) : 0;

  contentElement = batch.maybeMerge(contentElement, after) || contentElement;
  const mergedContentElement = batch.maybeMerge(before, contentElement);

  if (mergedContentElement) {
    return [mergedContentElement, translateRange(range, beforeLength)];
  }

  return [contentElement, range]
}

function createRange(batch, contentElement) {
  return batch.getLength(contentElement) ?
         [0, batch.getLength(contentElement)] :
         undefined;
}

function translateRange(range, delta) {
  return range && [range[0] + delta, range[1] + delta]
}

function copyPositionIfAvailable(batch, contentElement, sibling) {
  if (contentElement.getPosition() !== sibling.getPosition() &&
      contentElement.getAvailablePositions().includes(sibling.getPosition())) {
    batch.markForUpdate(contentElement, {
      ...contentElement.configuration.toJSON,
      position: sibling.getPosition()
    });
  }
}
