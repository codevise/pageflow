import Marionette from 'backbone.marionette';

import template from '../../pageflow/editor/templates/loading.jst';

export const LoadingView = Marionette.ItemView.extend({
  template,
  className: 'loading',
  tagName: 'li'
});
