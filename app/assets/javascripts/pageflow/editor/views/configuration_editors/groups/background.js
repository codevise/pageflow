pageflow.ConfigurationEditorTabView.groups.define('background', function(options) {
  options = options || {};

  var prefix = options.propertyNamePrefix ? options.propertyNamePrefix + '_' : '';
  var backgroundTypeProperty = prefix + 'background_type';

  this.input(backgroundTypeProperty, pageflow.SelectInputView, {
    values: ['image', 'video'],
    ensureValueDefined: true
  });
  this.input(prefix + 'background_image_id', pageflow.FileInputView, {
    collection: pageflow.imageFiles,
    visibleBinding: backgroundTypeProperty,
    visibleBindingValue: 'image',
    fileSelectionHandlerOptions: options
  });
  this.input(prefix + 'video_file_id', pageflow.FileInputView, {
    collection: pageflow.videoFiles,
    visibleBinding: backgroundTypeProperty,
    visibleBindingValue: 'video',
    fileSelectionHandlerOptions: options
  });
  this.input(prefix + 'poster_image_id', pageflow.FileInputView, {
    collection: pageflow.imageFiles,
    visibleBinding: backgroundTypeProperty,
    visibleBindingValue: 'video',
    fileSelectionHandlerOptions: options
  });
  this.input(prefix + 'mobile_poster_image_id', pageflow.FileInputView, {
    collection: pageflow.imageFiles,
    visibleBinding: backgroundTypeProperty,
    visibleBindingValue: 'video',
    fileSelectionHandlerOptions: options
  });
});