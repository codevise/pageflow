import {ContentElement} from '../ContentElement';
import {batch, nullCommand} from './batch';

export function insertContentElement(entry, sibling, attributes, {at, splitPoint}) {
  const section = sibling.section;
  const insertIndex = reindexPositionsToMakeRoomForInsertion(section, sibling, at);

  const commands = [
    at === 'split' && prepareSplit(entry, section, sibling, splitPoint),
    prepareInsertion(entry, section, sibling, attributes, insertIndex)
  ].filter(Boolean);

  section.contentElements.sort();

  batch(section, commands);
}

function reindexPositionsToMakeRoomForInsertion(section, sibling, at) {
  let delta = 0;
  let insertIndex;

  section.contentElements.forEach((contentElement, index) => {
    if (contentElement === sibling && at === 'before') {
      delta = 1;
      insertIndex = index;
    }

    contentElement.set('position', index + delta);

    if (contentElement === sibling) {
      if (at === 'after') {
        delta = 1;
        insertIndex = index + 1;
      }
      else if (at === 'split') {
        delta = 2;
        insertIndex = index + 1;
      }
    }
  });

  return insertIndex;
}

function prepareSplit(entry, section, sibling, splitPoint) {
  const [c1, c2] = sibling.getType().split(sibling.configuration.attributes, splitPoint);

  const splitOffContentElement = new ContentElement({
    typeName: sibling.get('typeName'),
    configuration: c2,
    position: sibling.get('position') + 2
  });

  section.contentElements.add(splitOffContentElement);

  return {
    batchItemFor(contentElement) {
      if (contentElement === sibling) {
        return {
          id: contentElement.id,
          configuration: c1
        };
      }
    },

    complete() {
      // Only persisted models are synchronized to React state. The
      // added content element therefore only becomes visible in the
      // preview after the batch request completed. Thus, we have to
      // wait with removing the split off part of the configuration.
      sibling.configuration.set(c1, {autoSave: false});
    },

    rollback() {
      entry.contentElements.remove(splitOffContentElement);
    }
  }
}

function prepareInsertion(entry, section, sibling, attributes, index) {
  const contentElement = new ContentElement({
    ...attributes,
    position: index
  });

  contentElement.applyDefaultConfiguration(sibling);
  section.contentElements.add(contentElement);

  return {
    ...nullCommand,

    complete() {
      entry.trigger('selectContentElement', contentElement);
    },

    rollback() {
      entry.contentElements.remove(contentElement);
    }
  }
}
