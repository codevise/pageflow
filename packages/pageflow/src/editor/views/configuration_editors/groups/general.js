pageflow.ConfigurationEditorTabView.groups.define('general', function(options) {
  this.input('title', pageflow.TextInputView, {required: true, maxLength: 5000});
  this.input('hide_title', pageflow.CheckBoxInputView);
  this.input('tagline', pageflow.TextInputView, {maxLength: 5000});
  this.input('subtitle', pageflow.TextInputView, {maxLength: 5000});
  this.input('text', pageflow.TextAreaInputView, {
    fragmentLinkInputView: pageflow.PageLinkInputView,
    enableLists: true
  });
  this.input('text_position', pageflow.SelectInputView, {
    values: options.supportsTextPositionCenter ?
            pageflow.Page.textPositions :
            pageflow.Page.textPositionsWithoutCenterOption
  });
  this.input('gradient_opacity', pageflow.SliderInputView);
  this.input('invert', pageflow.CheckBoxInputView);
});
