pageflow.app.addInitializer(function(options) {
  new pageflow.EditorView({
    el: $('body')
  }).render();

  pageflow.app.previewRegion.show(new pageflow.EntryPreviewView({
    model: pageflow.entry
  }));

  pageflow.app.notificationsRegion.show(new pageflow.NotificationsView().render());
  pageflow.app.helpButtonRegion.show(new pageflow.HelpButtonView().render());

  Backbone.history.start({root: options.root});
});

pageflow.app.addRegions({
  previewRegion: '#entry_preview',
  mainRegion: '#main_content',
  sidebarRegion: 'sidebar .container',
  dialogRegion: '.dialog_container',
  notificationsRegion: 'sidebar .notifications_container',
  helpButtonRegion: 'sidebar .help_button_container'
});
