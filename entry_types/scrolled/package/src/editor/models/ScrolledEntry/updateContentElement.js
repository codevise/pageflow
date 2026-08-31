import Backbone from 'backbone';

export function updateContentElement(entry, contentElement, configuration,
                                     {commentThreadSubjectRanges} = {}) {
  const changedRanges = diffAndApplySubjectRanges(
    entry.reviewSession, commentThreadSubjectRanges
  );

  contentElement.configuration.set(
    configuration, {autoSave: false, ignoreInWatchCollection: true}
  );

  Backbone.sync('update', contentElement, {
    attrs: {
      content_element: {configuration},
      ...(Object.keys(changedRanges).length > 0 &&
          {comment_thread_subject_ranges: changedRanges})
    }
  });
}

function diffAndApplySubjectRanges(reviewSession, ranges) {
  if (!reviewSession || !ranges) return {};

  const changed = reviewSession.diffSubjectRangeUpdates(ranges);
  reviewSession.applySubjectRangeUpdates(changed);

  return changed;
}
