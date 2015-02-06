pageflow.ConfigurationEditorTabView.groups.define('options', function() {
  this.input('display_in_navigation', pageflow.CheckBoxInputView);
  this.input('transition', pageflow.SelectInputView, {values: pageflow.pageTransitions.names()});
  this.input('description', pageflow.TextAreaInputView, {size: 'short'});
});