import {ContentElement} from '../ContentElement';
import Backbone from 'backbone';

// Allows recording changes to a section's content elements,
// persisting the changes to the server in a single request and
// applying them to the section once the requests succeeds.
//
// When a `reviewSession` is passed, structural ops that go through
// `split`/`maybeMerge` also collect the resulting comment-thread range
// updates and subject_id migrations so both the payload and the
// post-save `ReviewSession` state stay in sync with the new
// Slate coordinate system.
export function Batch(entry, section, {reviewSession} = {}) {
  // Shallow copy of the section's list of content elements to store
  // ordering changes and newly inserted content elements.
  const contentElements = section.contentElements.toArray();

  // Since contentElements is only a shallow copy, we cannot write
  // configuration changes to the actual content elements.
  const changedConfigurations = {};

  // Content elements that have been removed from contentElements
  // and shall be deleted on the server.
  const markedForDeletion = [];

  // New ranges for comment threads, keyed by threadId. Holds both
  // updates for threads that stay on their content element and the
  // post-shift range for threads being migrated (the latter also
  // appear in `threadMigrations`).
  const threadRangeUpdates = {};

  // Comment threads migrating to a different content element.
  // Shape: {threadId: targetContentElement}. The target reference is
  // resolved to an id (for existing) or to the newly-assigned
  // perma_id (for new, via applyAdditions) at payload-assembly /
  // success time.
  const threadMigrations = {};

  // Track whether changes have been recorded which need to be
  // persisted to the server.
  let isDirty = false;

  return {
    getAdjacent,
    getLength,
    split,
    maybeMerge,
    insertBefore,
    insertAfter,
    markForUpdate,
    markForDeletion,
    remove,
    save,
    saveIfDirty
  };

  function getAdjacent(contentElement) {
    const index = contentElements.indexOf(contentElement);

    return [
      contentElements[index - 1],
      contentElements[index + 1]
    ];
  }

  function getLength(contentElement) {
    return contentElement.getType().getLength ?
           contentElement.getType().getLength(getCurrentConfiguration(contentElement)) :
           0;
  }

  // Higher level transformations based on the more low level
  // transformations below:

  function split(contentElement, splitPoint, {insertAt} = {}) {
    const {before, after} = normalizeSplitResult(
      contentElement.getType().split(
        getCurrentConfiguration(contentElement),
        splitPoint,
        {ranges: collectRanges(contentElement)}
      )
    );
    let splitOffContentElement;

    if (insertAt === 'before') {
      splitOffContentElement = new ContentElement({
        typeName: contentElement.get('typeName'),
        configuration: before.configuration
      });

      insertBefore(contentElement, splitOffContentElement);
      markForUpdate(contentElement, after.configuration);

      recordRangeUpdates(after.ranges);
      recordThreadMigrations(before.ranges, splitOffContentElement);
    }
    else {
      splitOffContentElement = new ContentElement({
        typeName: contentElement.get('typeName'),
        configuration: after.configuration
      });

      markForUpdate(contentElement, before.configuration);
      insertAfter(contentElement, splitOffContentElement);

      recordRangeUpdates(before.ranges);
      recordThreadMigrations(after.ranges, splitOffContentElement);
    }

    return splitOffContentElement;
  }

  function maybeMerge(before, after) {
    if (!before ||
        !after ||
        before.get('typeName') !== after.get('typeName') ||
        !before.getType().merge) {
      return;
    }

    const rangesA = collectRanges(before);
    const rangesB = collectRanges(after);
    const {configuration: mergedConfiguration, ranges: mergedRanges} =
      normalizeMergeResult(
        before.getType().merge(
          getCurrentConfiguration(before),
          getCurrentConfiguration(after),
          {rangesA, rangesB}
        )
      );

    // Update the aleady persisted content element, if one has not yet
    // been persisted. For example, let X be a content element in
    // between two text blocks T1 and T2:
    //
    //   T1
    //     paragraph A
    //     paragraph B
    //   X
    //   T2
    //     paragraph C
    //
    // When X shall be moved between the two paragraphs of T1, the
    // second paragraph of T1 will first be split off into a new
    // content element T3:
    //
    //   T1
    //     paragraph A
    //   T3
    //     paragraph B
    //   X
    //   T2
    //     paragraph C
    //
    // Then X will be moved:
    //
    //   T1
    //     paragraph A
    //   X
    //   T3
    //     paragraph B
    //   T2
    //     paragraph C
    //
    // T3 and T2 become adjacent and need to be merged. We now want to
    // update T2 instead of creating T3 and deleting T2. Final state:
    //
    //   T1
    //     paragraph A
    //   X
    //   T2
    //     paragraph B
    //     paragraph C
    //
    const survivor = before.isNew() && !after.isNew() ? after : before;
    const removed = survivor === before ? after : before;
    const removedRanges = removed === before ? rangesA : rangesB;
    const survivorRanges = survivor === before ? rangesA : rangesB;

    markForUpdate(survivor, mergedConfiguration);
    remove(removed);
    if (!removed.isNew()) {
      markForDeletion(removed);
    }

    // The type's merge is expected to preserve every input thread id
    // in `mergedRanges` (with shifted offsets where appropriate), so
    // splitting `mergedRanges` along the input range maps is exhaustive.
    recordThreadMigrations(pickRanges(mergedRanges, removedRanges), survivor);
    recordRangeUpdates(pickRanges(mergedRanges, survivorRanges));

    return survivor;
  }

  function insertBefore(sibling, contentElement) {
    isDirty = true;
    contentElements.splice(contentElements.indexOf(sibling), 0, contentElement);
  }

  function insertAfter(sibling, contentElement) {
    isDirty = true;
    contentElements.splice(contentElements.indexOf(sibling) + 1, 0, contentElement);
  }

  function markForUpdate(contentElement, configuration) {
    isDirty = true;

    if (contentElement.isNew()) {
      contentElement.configuration.set(configuration);
    }
    else {
      changedConfigurations[contentElement.id] = configuration;
    }
  }

  function markForDeletion(contentElement) {
    isDirty = true;
    markedForDeletion.push(contentElement);
  }

  function remove(contentElement) {
    // We do not mark the batch as dirty here to allow removing an
    // element and adding it to another section. We are fine with
    // the resulting gap in the position attributes of the section's
    // content elements.
    contentElements.splice(contentElements.indexOf(contentElement), 1);
  }

  function getCurrentConfiguration(contentElement) {
    return changedConfigurations[contentElement.id] || contentElement.configuration.attributes;
  }

  // Bookkeeping for comment thread range updates and subject_id
  // migrations recorded by structural ops above. `reviewSession` is
  // only mutated in the post-save `applyThreadUpdates`, so callers
  // that read live ranges mid-batch must go through `collectRanges`
  // to see pending migrations.

  function collectRanges(contentElement) {
    if (!reviewSession) return {};

    const result = {};

    if (!contentElement.isNew()) {
      const threads = reviewSession.findThreadsFor({
        subjectType: 'ContentElement',
        subjectId: contentElement.get('permaId')
      });

      threads.forEach(thread => {
        // Threads with a pending migration away from this element are
        // excluded — `findThreadsFor` reads `reviewSession` state which
        // has not yet been updated for in-batch migrations, so it
        // would otherwise still return them.
        const migratedAway = thread.id in threadMigrations &&
                             threadMigrations[thread.id] !== contentElement;

        if (thread.subjectRange && !migratedAway) {
          result[thread.id] = thread.subjectRange;
        }
      });
    }

    // Threads migrated to this element earlier in the batch are not
    // yet reflected in reviewSession — include their pending ranges so
    // later ops on this element see them.
    Object.entries(threadMigrations).forEach(([threadId, target]) => {
      if (target === contentElement) {
        result[Number(threadId)] = threadRangeUpdates[threadId];
      }
    });

    return result;
  }

  function recordRangeUpdates(rangesByThreadId) {
    Object.entries(rangesByThreadId).forEach(([id, range]) => {
      threadRangeUpdates[Number(id)] = range;
    });
  }

  function recordThreadMigrations(rangesByThreadId, targetContentElement) {
    Object.entries(rangesByThreadId).forEach(([id, range]) => {
      recordThreadMigration(Number(id), targetContentElement, range);
    });
  }

  function recordThreadMigration(threadId, targetContentElement, newRange) {
    threadMigrations[threadId] = targetContentElement;
    threadRangeUpdates[threadId] = newRange;
    isDirty = true;
  }

  // Functionality to assemble and perform the batch request to
  // persist the recorded changes:

  function saveIfDirty(options) {
    if (isDirty) {
      save(options);
    }
  }

  function save({success} = {}) {
    isDirty = false;

    const commentThreadSubjectRanges = createCommentThreadSubjectRanges();

    Backbone.sync('update', section, {
      url: `${section.url()}/content_elements/batch`,
      attrs: {
        content_elements: createBatchItems(),
        ...(Object.keys(commentThreadSubjectRanges).length > 0 &&
            {comment_thread_subject_ranges: commentThreadSubjectRanges})
      },

      success(response) {
        // Each step's intermediate state is observable in the iframe
        // (Backbone change events propagate as separate postMessages
        // and re-render React without batching), so the order
        // resolves these dependencies:
        //
        // - permaIds before thread updates: thread migrations
        //   resolve `target.get('permaId')`.
        // - Thread updates before configuration changes: the
        //   value-flip render in `useCachedValue` clears rangeRefs
        //   and falls back to `thread.subjectRange`, which must
        //   already be migrated.
        // - Positions before additions: Backbone's collection
        //   comparator drops new elements into their sorted slot.
        // - Configuration changes before deletions: a delete-merge
        //   survivor grows before its sibling disappears (no
        //   brief collapse).
        applyPermaIds(response);
        applyThreadUpdates();
        applyConfigurationChanges();
        applyPositions();
        applyAdditions();
        applyDeletions();

        section.contentElements.sort();

        if (success) {
          success();
        }
      }
    });
  }

  function createBatchItems() {
    const migrateIdsByElement = groupMigrationsByElement();

    return [
      ...contentElements.map(contentElement => {
        const migrateIds = migrateIdsByElement.get(contentElement) || [];
        const isNew = contentElement.isNew();
        const changedConfiguration = changedConfigurations[contentElement.id];

        return {
          ...(isNew
            ? {typeName: contentElement.get('typeName'),
               configuration: contentElement.configuration.attributes}
            : {id: contentElement.id}),
          ...(!isNew && changedConfiguration && {configuration: changedConfiguration}),
          ...(migrateIds.length > 0 && {migrate_comment_threads: migrateIds})
        };
      }),
      ...markedForDeletion.map(contentElement => ({
        id: contentElement.id,
        _delete: true
      }))
    ];
  }

  function createCommentThreadSubjectRanges() {
    // Migrations whose new range matches the thread's current range
    // are filtered out by `diffSubjectRangeUpdates` here — that's
    // fine, the per-element `migrate_comment_threads` array still
    // moves the thread, and the unchanged range stays as-is on the
    // server.
    return reviewSession ?
           reviewSession.diffSubjectRangeUpdates(threadRangeUpdates) :
           {};
  }

  function groupMigrationsByElement() {
    return Object.entries(threadMigrations).reduce((map, [threadId, target]) => {
      const list = map.get(target) || [];
      list.push(Number(threadId));
      map.set(target, list);
      return map;
    }, new Map());
  }

  // Functionality to apply the recorded changes to the underlying
  // section once the request succeeded:

  function applyPermaIds(response) {
    contentElements.forEach((contentElement, index) => {
      if (contentElement.isNew()) {
        contentElement.set({
          id: response[index].id,
          permaId: response[index].permaId
        });
      }
    });
  }

  function applyAdditions() {
    contentElements.forEach(contentElement => {
      if (contentElement.section && contentElement.section !== section) {
        contentElement.section.contentElements.remove(contentElement);
        section.contentElements.add(contentElement);
      }
      else if (!section.contentElements.contains(contentElement)) {
        section.contentElements.add(contentElement);
      }
    });
  }

  function applyDeletions() {
    markedForDeletion.forEach(contentElement =>
      entry.contentElements.remove(contentElement)
    );
  }

  function applyPositions() {
    contentElements.forEach((contentElement, index) =>
      contentElement.set('position', index, {autoSave: false})
    );
  }

  function applyConfigurationChanges() {
    contentElements.forEach(contentElement => {
      if (changedConfigurations[contentElement.id]) {
        contentElement.configuration.set(changedConfigurations[contentElement.id], {autoSave: false});
      }
    });
  }

  function applyThreadUpdates() {
    if (!reviewSession) return;

    const updates = {};
    Object.entries(threadRangeUpdates).forEach(([id, range]) => {
      updates[id] = {subjectRange: range};
    });
    Object.entries(threadMigrations).forEach(([id, target]) => {
      updates[id] = {
        ...updates[id],
        subjectId: target.get('permaId')
      };
    });

    reviewSession.applyThreadUpdates(updates);
  }
}

// Types can still return the plain [cBefore, cAfter] shape from
// split() and a bare configuration object from merge(). Normalize both
// to the range-aware object shape for Batch internals.
function normalizeSplitResult(result) {
  if (Array.isArray(result)) {
    return {
      before: {configuration: result[0], ranges: {}},
      after: {configuration: result[1], ranges: {}}
    };
  }
  return result;
}

function pickRanges(source, keysSource) {
  const result = {};
  Object.keys(keysSource).forEach(id => { result[id] = source[id]; });
  return result;
}

function normalizeMergeResult(result) {
  if (result && typeof result === 'object' &&
      'configuration' in result && 'ranges' in result) {
    return result;
  }
  return {configuration: result, ranges: {}};
}
