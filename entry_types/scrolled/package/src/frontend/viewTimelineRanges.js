// Offsets of the subject's top edge relative to the viewport's top
// edge at the milestones of a content element's view timeline.
//
// Elements that are pinned in the viewport for part of their scroll
// space are measured along a taller subject: They move with the
// subject's top edge until they are pinned and continue with the
// subject's bottom edge once they have been.
const milestones = {
  firstVisible: ({viewportHeight}) => viewportHeight,

  firstContained: ({viewportHeight, elementHeight}) => viewportHeight - elementHeight,

  reachesCenter: ({viewportHeight}) => viewportHeight / 2,

  leavesCenter: ({subjectHeight, viewportHeight}) => viewportHeight / 2 - subjectHeight,

  lastContained: ({subjectHeight, elementHeight}) => elementHeight - subjectHeight,

  lastVisible: ({subjectHeight}) => -subjectHeight
};

const ranges = {
  // Mirror the named ranges of CSS scroll driven animations.
  cover: ['firstVisible', 'lastVisible'],
  contain: ['firstContained', 'lastContained'],
  entry: ['firstVisible', 'firstContained'],
  exit: ['lastContained', 'lastVisible'],

  // Same part of the page during which content elements become active
  // and autoplayed videos play.
  center: ['reachesCenter', 'leavesCenter']
};

export function getViewTimelineProgress({range, subjectRect, elementRect, viewportHeight}) {
  const milestoneNames = ranges[range];

  if (!milestoneNames) {
    throw new Error(`Unknown view timeline range '${range}'. ` +
                    `Supported ranges: ${Object.keys(ranges).join(', ')}.`);
  }

  // Without enough content next to it, a pinned element never reaches
  // its pinned position and keeps moving with the page. Its own rect
  // then is the subject covering the same range of the page.
  const subject = subjectRect.height > elementRect.height ? subjectRect : elementRect;

  const [start, end] = orderEdges(milestoneNames.map(name => milestones[name]({
    subjectHeight: subject.height,
    elementHeight: elementRect.height,
    viewportHeight
  })));

  if (start === end) {
    return subject.top <= start ? 1 : 0;
  }

  return clamp((start - subject.top) / (start - end));
}

// Milestones come out in reverse order for elements taller than the
// viewport: Such elements cover the viewport instead of being
// contained in it, so they stop being contained before they start
// being contained.
function orderEdges([start, end]) {
  return start < end ? [end, start] : [start, end];
}

function clamp(value) {
  return Math.min(Math.max(value, 0), 1);
}
