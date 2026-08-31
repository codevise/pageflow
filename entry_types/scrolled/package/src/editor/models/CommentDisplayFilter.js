import Backbone from 'backbone';

import {getLocalStorage} from 'pageflow/editor';

const resolutionStorageKey = 'pageflow.scrolled.editor.commentsResolution';
const alwaysShowStorageKey = 'pageflow.scrolled.editor.alwaysShowComments';

export const CommentDisplayFilter = Backbone.Model.extend({
  defaults: {
    resolution: 'unresolved',
    alwaysShowComments: true
  },

  initialize() {
    const storage = getLocalStorage();

    if (storage?.[resolutionStorageKey] === 'all') {
      this.set('resolution', 'all');
    }

    if (storage?.[alwaysShowStorageKey] === 'false') {
      this.set('alwaysShowComments', false);
    }

    this.listenTo(this, 'change:resolution', function() {
      store(resolutionStorageKey, this.get('resolution'));
    });

    this.listenTo(this, 'change:alwaysShowComments', function() {
      store(alwaysShowStorageKey, this.get('alwaysShowComments'));
    });
  },

  showsResolved() {
    return this.get('resolution') === 'all';
  }
});

function store(storageKey, value) {
  const storage = getLocalStorage();

  if (storage) {
    storage[storageKey] = value;
  }
}
