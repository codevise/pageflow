import Backbone from 'backbone';

// Update all content elements of a section at once. Batch requests
// update the order of content elements in a section. New content
// elements are persisted and updated with ids/perma ids read from the
// response.
//
// More complex changes can be performed via command
// objects. Those can be used to manipulate items that represents a
// content element in the batch request. Moreover, each command can
// contain logic that performs updates once the request has succeeded
// or rolls back local changes if the request fails.

export function batch(section, commands) {
  Backbone.sync('update', section, {
    url: `${section.url()}/content_elements/batch`,
    attrs: {
      content_elements: createBatchItems(section, commands)
    },

    success(response) {
      storePersistedIds(section, response);
      commands.forEach(command => command.complete());
    },

    error() {
      commands.forEach(command => command.rollback());
    }
  });
}

export const nullCommand = {
  batchItemFor() {},
  complete() {},
  rollback() {}
};

function createBatchItems(section, commands) {
  return section.contentElements.map(contentElement => {
    const item = findBatchItemFromCommand(contentElement, commands);

    if (item) {
      return item;
    }
    else if (contentElement.isNew()) {
      return {
        typeName: contentElement.get('typeName'),
        configuration: contentElement.configuration.toJSON()
      };
    }
    else {
      return contentElement.pick('id');
    }
  });
}

function findBatchItemFromCommand(contentElement, commands) {
  return commands.reduce(
    (result, command) => result || command.batchItemFor(contentElement),
    null
  );
}

function storePersistedIds(section, response) {
  section.contentElements.each((contentElement, index) => {
    if (contentElement.isNew()) {
      contentElement.set({
        id: response[index].id,
        permaId: response[index].permaId
      });
    }
  });
}
