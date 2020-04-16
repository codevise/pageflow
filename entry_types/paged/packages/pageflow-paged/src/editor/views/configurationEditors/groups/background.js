import {ConfigurationEditorTabView, SelectInputView} from 'pageflow/ui';

import {FileInputView} from 'pageflow/editor';

import {state} from '$state';

ConfigurationEditorTabView.groups.define('background', function(options) {
  options = options || {};

  var prefix = options.propertyNamePrefix ? options.propertyNamePrefix + '_' : '';
  var backgroundTypeProperty = prefix + 'background_type';

  this.input(backgroundTypeProperty, SelectInputView, {
    values: ['image', 'video'],
    ensureValueDefined: true
  });
  this.input(prefix + 'background_image_id', FileInputView, {
    collection: state.imageFiles,
    visibleBinding: backgroundTypeProperty,
    visibleBindingValue: 'image',
    fileSelectionHandlerOptions: options
  });
  this.input(prefix + 'video_file_id', FileInputView, {
    collection: state.videoFiles,
    visibleBinding: backgroundTypeProperty,
    visibleBindingValue: 'video',
    fileSelectionHandlerOptions: options
  });
  this.input(prefix + 'poster_image_id', FileInputView, {
    collection: state.imageFiles,
    visibleBinding: backgroundTypeProperty,
    visibleBindingValue: 'video',
    fileSelectionHandlerOptions: options
  });
  this.input(prefix + 'mobile_poster_image_id', FileInputView, {
    collection: state.imageFiles,
    visibleBinding: backgroundTypeProperty,
    visibleBindingValue: 'video',
    fileSelectionHandlerOptions: options
  });
});
