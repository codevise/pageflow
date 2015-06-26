pageflow.ConfigurationEditorTabView.groups.define('options', function() {
  this.input('display_in_navigation', pageflow.CheckBoxInputView);
  this.group('page_transitions');
  this.input('description', pageflow.TextAreaInputView, {size: 'short'});
});