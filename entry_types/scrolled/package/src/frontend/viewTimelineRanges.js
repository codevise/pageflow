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

  lastVisible: ({subjectHeight}) => -subjectHeight,

  // The pinned position is only known while the element actually is
  // pinned. That is exactly when progress along the pinned range is
  // between 0 and 1, though: Before, the element's top edge coincides
  // with the subject's, after, its bottom edge does. Both edges of the
  // range therefore come out equally far off in those phases, which
  // makes progress clamp to 0 respectively 1.
  reachesPinnedPosition: ({elementTop}) => elementTop,

  leavesPinnedPosition: ({elementTop, subjectHeight, elementHeight}) =>
    elementTop - subjectHeight + elementHeight
};

const ranges = {
  // Mirror the named ranges of CSS scroll driven animations.
  cover: ['firstVisible', 'lastVisible'],
  contain: ['firstContained', 'lastContained'],
  entry: ['firstVisible', 'firstContained'],
  exit: ['lastContained', 'lastVisible'],

  // Same part of the page during which content elements become active
  // and autoplayed videos play.
  center: ['reachesCenter', 'leavesCenter'],

  // Only elements that components like TwoColumn or
  // ContentElementScrollSpace pin in the viewport have a pinned phase.
  pinned: ['reachesPinnedPosition', 'leavesPinnedPosition']
};

const rangeAliases = {
  // Elements that are pinned in the viewport hold the reader's
  // attention while they stay in place. Elements that are not pinned
  // at all do so while they pass the center of the viewport.
  inFocus: hasPinnedPhase => hasPinnedPhase ? 'pinned' : 'center'
};

export function getViewTimelineProgress({range, subjectRect, elementRect, viewportHeight}) {
  const hasPinnedPhase = subjectRect.height > elementRect.height;
  const alias = rangeAliases[range];

  const milestoneNames = ranges[alias ? alias(hasPinnedPhase) : range];

  if (!milestoneNames) {
    const supportedRanges = [...Object.keys(ranges), ...Object.keys(rangeAliases)];

    throw new Error(`Unknown view timeline range '${range}'. ` +
                    `Supported ranges: ${supportedRanges.join(', ')}.`);
  }

  // Without enough content next to it, a pinned element never reaches
  // its pinned position and keeps moving with the page. Its own rect
  // then is the subject covering the same range of the page.
  const subject = hasPinnedPhase ? subjectRect : elementRect;

  const [start, end] = orderEdges(milestoneNames.map(name => milestones[name]({
    subjectHeight: subject.height,
    elementTop: elementRect.top,
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
