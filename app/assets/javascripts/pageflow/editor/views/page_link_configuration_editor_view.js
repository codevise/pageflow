pageflow.PageLinkConfigurationEditorView = pageflow.ConfigurationEditorView.extend({
  configure: function() {
    this.tab('general', function() {
      this.group('page_link');
    });
  }
});
