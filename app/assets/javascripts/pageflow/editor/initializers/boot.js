pageflow.app.addInitializer(function(options) {
  new pageflow.EditorView({
    el: $('body')
  }).render();

  new pageflow.ScrollingView({
    el: $('sidebar .scrolling'),
    region: pageflow.app.sidebarRegion
  }).render();

  pageflow.app.previewRegion.show(new pageflow.EntryPreviewView({
    model: pageflow.entry
  }));

  pageflow.app.indicatorsRegion.show(new pageflow.DisabledAtmoIndicatorView());
  pageflow.app.notificationsRegion.show(new pageflow.NotificationsView());
  pageflow.app.sidebarFooterRegion.show(new pageflow.SidebarFooterView({
    model: pageflow.entry
  }));

  Backbone.history.start({root: options.root});
});

pageflow.app.addRegions({
  previewRegion: '#entry_preview',
  mainRegion: '#main_content',
  indicatorsRegion: '#editor_indicators',
  sidebarRegion: 'sidebar .container',
  dialogRegion: '.dialog_container',
  notificationsRegion: 'sidebar .notifications_container',
  sidebarFooterRegion: 'sidebar .sidebar_footer_container'
});
