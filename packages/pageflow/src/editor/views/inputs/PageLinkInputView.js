import {editor} from '../../base';

import {ReferenceInputView} from './ReferenceInputView';

import {state} from '$state';

/**
 * Input view to reference a page.
 *
 * @class
 * @memberof module:pageflow/editor
 */
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
