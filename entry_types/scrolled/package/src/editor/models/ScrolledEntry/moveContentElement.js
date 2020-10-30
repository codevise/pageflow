import {Batch} from './Batch';

// Move content element inside section or between sections. Allow
// moving content elements to "split points" inside content elements
// with custom split functions (e.g. between two paragraphs of a text
// block). Merge content elements of the same type that become
// adjacent by moving a content element away (e.g. two text blocks
// surrounding an image that is moved away).
export function moveContentElement(entry, contentElement, sibling, at, splitPoint) {
  const sourceBatch = new Batch(entry, contentElement.section);

  // If we move content elements between sections, merges will need to
  // be performed in the section where the content element came from.
  const targetBatch = sibling.section === contentElement.section ?
                      sourceBatch :
                      new Batch(entry, sibling.section);

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

  // Check if element was dragged to same position where it came from.
  if (!(at === 'before' && sibling === after) && !(at === 'after' && sibling === before)) {
    sourceBatch.remove(contentElement);

    if (at === 'before') {
      targetBatch.insertBefore(sibling, contentElement);
    }
    else {
      targetBatch.insertAfter(sibling, contentElement);
    }

    sourceBatch.maybeMerge(before, after);
  }

  // Dragging an element next to a sticky element, shall make the
  // moved element sticky as well.
  copyPositionIfAvailable(targetBatch, contentElement, sibling);

  targetBatch.saveIfDirty();
  sourceBatch.saveIfDirty();
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
