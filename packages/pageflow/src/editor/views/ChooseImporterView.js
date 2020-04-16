import Marionette from 'backbone.marionette';

import template from '../templates/chooseImporter.jst';
import {dialogView} from './mixins/dialogView';
import {app} from '../app';
import {editor} from '../base'
import { ImporterSelectView } from './ImporterSelectView';

export const ChooseImporterView = Marionette.ItemView.extend({
  template,
  className: 'choose_importer editor dialog',
  mixins: [dialogView],
  ui: {
    importersList: '.importers_panel',
    closeButton: '.close'
  },
  events: {
    'click .close': function() {
      this.close();
    }
  },
  importerSelected: function (importer) {
    if (this.options.callback) {
      this.options.callback(importer);
    }
    this.close();
  },
  onRender: function() {
    let self = this;
    editor.fileImporters.values().forEach((fileImporter) => {
      let importerSelectView = new ImporterSelectView({
        importer: fileImporter,
        parentView: self
      }).render();
      self.ui.importersList.append(importerSelectView.$el);
    });
  },
});

ChooseImporterView.open = function(options) {
  app.dialogRegion.show(new ChooseImporterView(options).render());
};
