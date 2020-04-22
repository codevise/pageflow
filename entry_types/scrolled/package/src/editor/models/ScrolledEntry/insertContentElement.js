import {ContentElement} from '../ContentElement';
import {batch, nullCommand} from './batch';

export function insertContentElement(entry, sibling, attributes, {position, at}) {
  const section = sibling.section;
  const insertIndex = reindexPositionsToMakeRoomForInsertion(section, sibling, position);

  const commands = [
    prepareInsertion(entry, section, attributes, insertIndex)
  ];

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
    }
  });

  return insertIndex;
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
      section.contentElements.remove(contentElement);
    }
  }
}
