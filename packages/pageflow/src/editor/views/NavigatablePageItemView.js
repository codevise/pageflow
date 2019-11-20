import {PageItemView} from './PageItemView';
import {failureIndicatingView} from './mixins/failureIndicatingView';
import {loadable} from './mixins/loadable';

import {editor} from '../base';

export const NavigatablePageItemView = PageItemView.extend({
  mixins: [loadable, failureIndicatingView],
  className: 'draggable',

  events: {
    'click': function() {
      if (!this.model.isNew() && !this.model.isDestroying()) {
        editor.navigate('/pages/' + this.model.get('id'), {trigger: true});
      }
      return false;
    }
  }
});
