pageflow.FileSettingsDialogView = Backbone.Marionette.ItemView.extend({
  template: 'templates/file_settings_dialog',
  className: 'file_settings_dialog editor dialog',

  mixins: [pageflow.dialogView],

  ui: {
    content: '.content'
  },

  onRender: function() {
    this.tabsView = new pageflow.TabsView({
      model: this.model,
      i18n: 'pageflow.editor.files.settings_dialog_tabs',
      defaultTab: this.options.tabName
    });

    _.each(this.model.fileType().settingsDialogTabs, function(options) {
      this.tabsView.tab(options.name, _.bind(function() {
        return this.subview(new options.view(
          _.extend({model: this.model}, options.viewOptions)));
      }, this));
    }, this);

    this.ui.content.append(this.subview(this.tabsView).el);
  }
});

pageflow.FileSettingsDialogView.open = function(options) {
  pageflow.app.dialogRegion.show(new pageflow.FileSettingsDialogView(options));
};
