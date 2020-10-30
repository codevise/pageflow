import {ContentElement} from '../ContentElement';
import Backbone from 'backbone';

// Allows recording changes to a section's content elements,
// persisting the changes to the server in a single request and
// applying them to the section once the requests succeeds.
export function Batch(entry, section) {
  // Shallow copy of the section's list of content elements to store
  // ordering changes and newly inserted content elements.
  const contentElements = section.contentElements.toArray();

  // Since contentElements is only a shallow copy, we cannot write
  // configuration changes to the actual content elements.
  const changedConfigurations = {};

  // Content elements that have been removed from contentElements
  // and shall be deleted on the server.
  const markedForDeletion = [];

  // Track whether changes have been recorded which need to be
  // persisted to the server.
  let isDirty = false;

  return {
    getAdjacent,
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

  // Higher level transformations based on the more low level
  // transformations below:

  function split(contentElement, splitPoint, {insertAt} = {}) {
    const [c1, c2] = contentElement.getType().split(getCurrentConfiguration(contentElement), splitPoint);
    let splitOffContentElement;

    if (insertAt === 'before') {
      splitOffContentElement = new ContentElement({
        typeName: contentElement.get('typeName'),
        configuration: c1
      });

      insertBefore(contentElement, splitOffContentElement);
      markForUpdate(contentElement, c2);
    }
    else {
      splitOffContentElement = new ContentElement({
        typeName: contentElement.get('typeName'),
        configuration: c2
      });

      markForUpdate(contentElement, c1);
      insertAfter(contentElement, splitOffContentElement);
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

    const mergedConfiguration = before.getType().merge(getCurrentConfiguration(before),
                                                       getCurrentConfiguration(after));

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
    if (before.isNew() && !after.isNew()) {
      remove(before);
      markForUpdate(after, mergedConfiguration);
    }
    else {
      markForUpdate(before, mergedConfiguration);
      remove(after);

      if (!after.isNew()) {
        markForDeletion(after);
      }
    }
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
    changedConfigurations[contentElement.id] = configuration;
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

  // Functionality to assemble and perform the batch request to
  // persist the recorded changes:

  function saveIfDirty(options) {
    if (isDirty) {
      save(options);
    }
  }

  function save({success} = {}) {
    isDirty = false;

    Backbone.sync('update', section, {
      url: `${section.url()}/content_elements/batch`,
      attrs: {
        content_elements: createBatchItems()
      },

      success(response) {
        applyConfigurationChanges();
        applyPositions();
        applyAdditions(response);
        applyDeletions();

        section.contentElements.sort();

        if (success) {
          success();
        }
      }
    });
  }

  function createBatchItems() {
    return [
      ...contentElements.map(contentElement => {
        if (contentElement.isNew()) {
          return {
            typeName: contentElement.get('typeName'),
            configuration: contentElement.configuration.attributes
          };
        }
        else if (changedConfigurations[contentElement.id]) {
          return {
            id: contentElement.id,
            configuration: changedConfigurations[contentElement.id]
          };
        }
        else {
          return contentElement.pick('id');
        }
      }),
      ...markedForDeletion.map(contentElement => ({
        id: contentElement.id,
        _delete: true
      }))
    ];
  }

  // Functionality to apply the recorded changes to the underlying
  // section once the request succeeded:

  function applyAdditions(response) {
    contentElements.forEach((contentElement, index) => {
      if (contentElement.isNew()) {
        section.contentElements.add(contentElement);

        contentElement.set({
          id: response[index].id,
          permaId: response[index].permaId
        });
      }
      else if (contentElement.section !== section) {
        contentElement.section.contentElements.remove(contentElement);
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
}
