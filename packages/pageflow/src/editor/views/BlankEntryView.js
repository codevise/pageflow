import Marionette from 'backbone.marionette';

import template from '../templates/blankEntry.jst';

export const BlankEntryView = Marionette.ItemView.extend({
  template,
  className: 'blank_entry'
});