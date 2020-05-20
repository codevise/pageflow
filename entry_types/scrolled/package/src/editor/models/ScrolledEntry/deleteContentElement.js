import {batch, nullCommand} from './batch';

export function deleteContentElement(entry, contentElement) {
  batch(contentElement.section, [
    prepareMerge(entry, contentElement),
    prepareDeletion(entry, contentElement)
  ]);
}

function prepareDeletion(entry, deletedContentElement) {
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

function prepareMerge(entry, deletedContentElement) {
  const [before, after] = deletedContentElement.getAdjacentContentElements();

  if (!before ||
      !after ||
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
