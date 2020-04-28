import {ContentElement} from '../ContentElement';
import {batch, nullCommand} from './batch';

export function insertContentElement(entry, sibling, attributes, {position, at}) {
  const section = sibling.section;
  const insertIndex = reindexPositionsToMakeRoomForInsertion(section, sibling, position);

  const commands = [
    position === 'split' && prepareSplit(entry, section, sibling, at),
    prepareInsertion(entry, section, attributes, insertIndex)
  ].filter(Boolean);

  section.contentElements.sort();

  batch(section, commands);
}

function reindexPositionsToMakeRoomForInsertion(section, sibling, position) {
  let delta = 0;
  let insertIndex;

  section.contentElements.forEach((contentElement, index) => {
    if (contentElement === sibling && position === 'before') {
      delta = 1;
      insertIndex = index;
    }

    contentElement.set('position', index + delta);

    if (contentElement === sibling) {
      if (position === 'after') {
        delta = 1;
        insertIndex = index + 1;
      }
      else if (position === 'split') {
        delta = 2;
        insertIndex = index + 1;
      }
    }
  });

  return insertIndex;
}

function prepareSplit(entry, section, sibling, at) {
  const [c1, c2] = sibling.getType().split(sibling.configuration.attributes, at);

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

function prepareInsertion(entry, section, attributes, index) {
  const contentElement = new ContentElement({
    ...attributes,
    position: index
  });

  contentElement.configuration.set(contentElement.getType().defaultConfig);
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
