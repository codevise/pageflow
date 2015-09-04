pageflow.ConfigurationEditorTabView.groups.define('page_link', function() {
  this.input('label', pageflow.TextInputView);
  this.input('target_page_id', pageflow.PageLinkInputView);
  this.input('page_transition', pageflow.SelectInputView, {
    translationKeyPrefix: 'pageflow.page_transitions',
    includeBlank: true,
    blankTranslationKey: 'pageflow.editor.views.edit_page_link_view.default_page_transition',
    values: pageflow.pageTransitions.names()
  });
});