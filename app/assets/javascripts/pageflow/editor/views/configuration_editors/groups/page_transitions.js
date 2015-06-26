pageflow.ConfigurationEditorTabView.groups.define('page_transitions', function() {
  this.input('transition', pageflow.SelectInputView, {
    translationKeyPrefix: 'pageflow.page_transitions',
    values: pageflow.pageTransitions.names()
  });
});