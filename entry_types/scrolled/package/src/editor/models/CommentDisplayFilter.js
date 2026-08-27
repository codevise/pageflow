import Backbone from 'backbone';

import {getLocalStorage} from 'pageflow/editor';

const resolutionStorageKey = 'pageflow.scrolled.editor.commentsResolution';
const alwaysShowStorageKey = 'pageflow.scrolled.editor.alwaysShowComments';

// Which comments the editor displays, in its sidebar lists as well as in
// the preview: the resolutions of a thread, and whether comments show
// anywhere or only on what is selected. Remembered under keys of its own,
// so that the editor and the published entry's preview mode do not
// inherit each other's setting.
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
