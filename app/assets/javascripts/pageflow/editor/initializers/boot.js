pageflow.app.addInitializer(function(options) {
  new pageflow.EditorView({
    el: $('body')
  }).render();

  pageflow.app.mainRegion.show(new pageflow.EntryPreviewView({
    model: pageflow.entry
  }));

  pageflow.app.notificationsRegion.show(new pageflow.NotificationsView().render());
  pageflow.app.helpButtonRegion.show(new pageflow.HelpButtonView().render());

  window.editor = new pageflow.SidebarRouter({
    controller: new pageflow.SidebarController({
      region: pageflow.app.sidebarRegion,
      entry: pageflow.entry
    })
  });

  Backbone.history.start({root: options.root});
});

pageflow.app.addRegions({
  mainRegion: 'main',
  sidebarRegion: 'sidebar .container',
  dialogRegion: '.dialog_container',
  notificationsRegion: 'sidebar .notifications_container',
  helpButtonRegion: 'sidebar .help_button_container'
});