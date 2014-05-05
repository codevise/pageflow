pageflow.ConfigurationEditorTabView.groups.define('options', function() {
  this.input('display_in_navigation', pageflow.CheckBoxInputView);
  this.input('transition', pageflow.SelectInputView, {values: pageflow.Page.transitions});
  this.input('description', pageflow.TextAreaInputView, {size: 'short'});
});