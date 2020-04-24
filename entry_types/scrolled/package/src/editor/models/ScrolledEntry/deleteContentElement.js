import {batch, nullCommand} from './batch';

export function deleteContentElement(contentElement) {
  const section = contentElement.section;

  batch(section, [
    prepareDeletion(section, contentElement)
  ]);
}

function prepareDeletion(section, deletedContentElement) {
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
      section.contentElements.remove(deletedContentElement);
    }
  }
}
