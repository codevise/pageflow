import {CheckBoxInputView, ConfigurationEditorView, TextAreaInputView, TextInputView} from 'pageflow/ui';
import {features} from 'pageflow/frontend';

import {FileInputView} from 'pageflow/editor';

import {state} from '$state';

ConfigurationEditorView.register('video', {
  configure: function() {
    this.tab('general', function() {
      this.group('general', {supportsTextPositionCenter: true});

      this.input('additional_title', TextInputView);
      this.input('additional_description', TextAreaInputView, {size: 'short'});
    });

    this.tab('files', function() {
      this.input('video_file_id', FileInputView, {
        collection: state.videoFiles,
        positioning: false,
        defaultTextTrackFilePropertyName: 'default_text_track_file_id'
      });
      this.input('poster_image_id', FileInputView, {
        collection: state.imageFiles,
        positioning: false,
      });
      this.input('mobile_poster_image_id', FileInputView, {
        collection: state.imageFiles,
        positioning: true
      });
      this.input('thumbnail_image_id', FileInputView, {
        collection: state.imageFiles,
        positioning: false
      });
    });

    this.tab('options', function() {
      this.input('autoplay', CheckBoxInputView);

      if (features.isEnabled('auto_change_page')) {
        this.input('auto_change_page_on_ended', CheckBoxInputView);
      }

      this.group('options', {canPauseAtmo: true});
    });
  }
});
