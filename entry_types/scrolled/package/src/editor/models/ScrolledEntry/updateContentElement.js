import Backbone from 'backbone';

// Optimistically update a single content element's configuration and
// the subject ranges of its comment threads. Bypasses the
// configurationContainer autosave - the React layer is already the
// source of truth for both the configuration value and the tracked
// thread ranges, so we apply locally and send immediately via PATCH.
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
