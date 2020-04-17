import Marionette from 'backbone.marionette';

import template from '../templates/importerSelect.jst';

export const ImporterSelectView = Marionette.ItemView.extend({
  template,
  className: 'importer_select',
  tagName: 'li',
  events: {
    'click .importer': function(event) {
      this.options.parentView.importerSelected(this.options.importer);
    }
  },
  initialize: function(options) {},
  serializeData: function(){
    return {
      fileImporter: this.options.importer
    };
  }
});
