export function maybeMergeWithAdjacent(batch, contentElement) {
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
