// Offsets of the subject's top edge relative to the viewport's top
// edge at the start and end of each range. Mirrors the named ranges of
// CSS scroll driven animations.
const rangeEdges = {
  cover: (subjectHeight, viewportHeight) => [viewportHeight, -subjectHeight],

  contain: (subjectHeight, viewportHeight) => [
    Math.max(viewportHeight - subjectHeight, 0),
    Math.min(viewportHeight - subjectHeight, 0)
  ],

  entry: (subjectHeight, viewportHeight) => [viewportHeight, viewportHeight - subjectHeight],

  exit: (subjectHeight, viewportHeight) => [0, -subjectHeight]
};

export function getViewTimelineProgress({range, rect, viewportHeight}) {
  const edges = rangeEdges[range];

  if (!edges) {
    throw new Error(`Unknown view timeline range '${range}'. ` +
                    `Supported ranges: ${Object.keys(rangeEdges).join(', ')}.`);
  }

  const [start, end] = edges(rect.height, viewportHeight);

  if (start === end) {
    return rect.top <= start ? 1 : 0;
  }

  return clamp((start - rect.top) / (start - end));
}

function clamp(value) {
  return Math.min(Math.max(value, 0), 1);
}
