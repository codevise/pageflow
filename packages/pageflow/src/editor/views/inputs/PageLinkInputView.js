import {editor} from '../../base';

import {ReferenceInputView} from './ReferenceInputView';

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
