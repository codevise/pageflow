import Backbone from 'backbone';

import {getLocalStorage} from '../utils/localStorage';

export const FileTypeSelection = Backbone.Model.extend({
  defaults() {
    return {collectionNames: []};
  },

  initialize(attributes, options = {}) {
    this.storageKey = options.storageKey;

    if (!this.storageKey) {
      return;
    }

    const storage = getLocalStorage();

    if (storage && storage[this.storageKey] != null) {
      this.set('collectionNames', parseCollectionNames(storage[this.storageKey]));
    }

    this.on('change:collectionNames', function() {
      const storage = getLocalStorage();

      if (storage) {
        storage[this.storageKey] = this.get('collectionNames').join(',');
      }
    });
  },

  select(collectionNames) {
    this.set('collectionNames', collectionNames);
  },

  selectOnly(collectionName) {
    this.select(this.isOnlySelected(collectionName) ? [] : [collectionName]);
  },

  toggle(collectionName) {
    const collectionNames = this.get('collectionNames');

    this.select(this.isSelected(collectionName) ?
                collectionNames.filter(name => name !== collectionName) :
                [...collectionNames, collectionName]);
  },

  isSelected(collectionName) {
    return this.get('collectionNames').includes(collectionName);
  },

  isOnlySelected(collectionName) {
    const collectionNames = this.get('collectionNames');

    return collectionNames.length === 1 && collectionNames[0] === collectionName;
  },

  matches(file) {
    const collectionNames = this.get('collectionNames');

    return !collectionNames.length ||
           collectionNames.includes(file.fileType().collectionName);
  }
});

function parseCollectionNames(value) {
  return value.split(',').filter(Boolean);
}
