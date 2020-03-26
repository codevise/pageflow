import {editor} from 'pageflow-scrolled/editor';
import {ConfigurationEditorTabView, CheckBoxInputView, SelectInputView, TextInputView, UrlInputView} from 'pageflow/ui';
import {FileInputView} from 'pageflow/editor';

ConfigurationEditorTabView.groups.define('audio_background', function(){
  this.input('background_type', SelectInputView, {
    values: ['background_image', 'background_video'],
    ensureValueDefined: true
  });
  this.input('background_image_id', FileInputView, {
    collection: 'image_files',
    visibleBinding: 'background_type',
    visibleBindingValue: 'background_image',
    fileSelectionHandler: 'contentElementConfiguration'
  });
  this.input('video_file_id', FileInputView, {
    collection: 'video_files',
    visibleBinding: 'background_type',
    visibleBindingValue: 'background_video',
    fileSelectionHandler: 'contentElementConfiguration'
  });
});

editor.contentElementTypes.register('inlineAudio', {
  configurationEditor() {
    this.tab('general', function() {
      this.input('source', FileInputView, {
        collection: 'audio_files',
        fileSelectionHandler: 'contentElementConfiguration',
        positioning: false
      });
      this.input('player_controls', SelectInputView, {
        values: ['classic', 'slim', 'waveform']
      });
      this.group('audio_background');
    });
  }
});
