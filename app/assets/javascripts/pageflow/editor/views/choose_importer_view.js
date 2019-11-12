pageflow.ChooseImporterView = Backbone.Marionette.ItemView.extend({
  template: 'templates/choose_importer',
  className: 'choose_importer editor dialog',

  mixins: [pageflow.dialogView],

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
    pageflow.editor.fileImporters.keys().forEach(function (fileImporter) {
      var label = I18n.t('pageflow.editor.file_importers.'+fileImporter+'.label');
      self.ui.importersList.append('<li><button class="importer" data-key="'+ fileImporter +'">' + label + '</button></li>');
    });
  },
});

pageflow.ChooseImporterView.open = function(options) {
  pageflow.app.dialogRegion.show(new pageflow.ChooseImporterView(options).render());
};
