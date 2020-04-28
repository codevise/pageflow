import {batch, nullCommand} from './batch';

export function deleteContentElement(entry, contentElement) {
  const section = contentElement.section;

  batch(section, [
    prepareMerge(entry, section, contentElement),
    prepareDeletion(entry, section, contentElement)
  ]);
}

function prepareDeletion(entry, section, deletedContentElement) {
  return {
    ...nullCommand,

    batchItemFor(contentElement) {
      if (contentElement === deletedContentElement) {
        return {
          id: contentElement.id,
          _delete: true
        };
      }
    },

    complete() {
      entry.contentElements.remove(deletedContentElement);
    }
  }
}

function prepareMerge(entry, section, deletedContentElement) {
  const [before, after] = getAdjacentContentElements(section, deletedContentElement);

  if (!before ||
      before.get('typeName') !== after.get('typeName') ||
      !before.getType().merge) {
    return nullCommand;
  }

  const mergedConfiguration = before.getType().merge(before.configuration.attributes,
                                                     after.configuration.attributes);

  return {
    ...nullCommand,

    batchItemFor(contentElement) {
      if (contentElement === before) {
        return {
          id: contentElement.id,
          configuration: mergedConfiguration
        };
      }
      else if (contentElement === after) {
        return {
          id: contentElement.id,
          _delete: true
        };
      }
    },

    complete() {
      before.configuration.set(mergedConfiguration, {autoSave: false});
      entry.contentElements.remove(after);
    }
  }
}

function getAdjacentContentElements(section, contentElement) {
  const index = section.contentElements.indexOf(contentElement);

  if (index === 0 || index === section.contentElements.length - 1) {
    return [];
  }

  return [
    section.contentElements.at(index - 1),
    section.contentElements.at(index + 1)
  ];
}
