import {ReferenceInputView, editor} from 'pageflow/editor';

import {state} from '$state';

export const PageLinkInputView = ReferenceInputView.extend({
  choose: function() {
    return editor.selectPage({
      isAllowed: this.options.isAllowed
    });
  },

  getTarget: function(permaId) {
    return state.pages.getByPermaId(permaId);
  }
});
