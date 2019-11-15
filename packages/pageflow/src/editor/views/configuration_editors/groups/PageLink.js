pageflow.ConfigurationEditorTabView.groups.define('page_link', function() {
  this.input('label', pageflow.TextInputView);
  this.input('target_page_id', pageflow.PageLinkInputView);
  this.group('page_transitions', {
    includeBlank: true
  });
});
