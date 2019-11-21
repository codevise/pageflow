import Backbone from 'backbone';
import Marionette from 'backbone.marionette';

import template from '../templates/chooseImporter.jst';
import {dialogView} from './mixins/dialogView';
import {app} from '../app';
import {editor} from '../base'

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
    },
    'click .importer': function(event) {
      if (this.options.callback) {
        this.options.callback(event.target.getAttribute('data-key'));
      }
      this.close();
    }
  },

  initialize: function(options) {
  },

  onRender: function() {
    var self = this;
    editor.fileImporters.keys().forEach(function (fileImporter) {
      var label = I18n.t('pageflow.editor.file_importers.'+fileImporter+'.label');
      self.ui.importersList.append('<li><button class="importer" data-key="'+ fileImporter +'">' + label + '</button></li>');
    });
  },
});

ChooseImporterView.open = function(options) {
  app.dialogRegion.show(new ChooseImporterView(options).render());
};
