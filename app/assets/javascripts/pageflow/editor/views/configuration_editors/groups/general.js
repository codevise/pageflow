pageflow.ConfigurationEditorTabView.groups.define('general', function() {
  this.input('title', pageflow.TextInputView, {required: true, maxLength: 5000});
  this.input('hide_title', pageflow.CheckBoxInputView);
  this.input('tagline', pageflow.TextInputView, {maxLength: 5000});
  this.input('subtitle', pageflow.TextInputView, {maxLength: 5000});
  this.input('text', pageflow.TextAreaInputView);
  this.input('text_position', pageflow.SelectInputView, {values: pageflow.Page.textPositions});
  this.input('gradient_opacity', pageflow.SliderInputView);
  this.input('invert', pageflow.CheckBoxInputView);
});
