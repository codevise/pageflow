import Backbone from 'backbone';

import {getLocalStorage} from 'pageflow/editor';

const storageKey = 'pageflow.scrolled.editor.commentsResolution';

// Which resolutions of a comment thread the editor displays, in its
// sidebar lists as well as in the preview. Remembered under a key of its
// own, so that the editor and the published entry's preview mode do not
// inherit each other's setting.
export const CommentDisplayFilter = Backbone.Model.extend({
  defaults: {
    resolution: 'unresolved'
  },

  initialize() {
    if (getLocalStorage()?.[storageKey] === 'all') {
      this.set('resolution', 'all');
    }

    this.listenTo(this, 'change:resolution', function() {
      const storage = getLocalStorage();

      if (storage) {
        storage[storageKey] = this.get('resolution');
      }
    });
  },

  showsResolved() {
    return this.get('resolution') === 'all';
  }
});
