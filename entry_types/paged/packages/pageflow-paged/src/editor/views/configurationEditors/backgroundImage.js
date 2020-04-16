import {ConfigurationEditorView} from 'pageflow/ui';

import {FileInputView} from 'pageflow/editor';

import {state} from '$state';

ConfigurationEditorView.register('background_image', {
  configure: function() {
    this.tab('general', function() {
      this.group('general', {supportsTextPositionCenter: true});
    });

    this.tab('files', function() {
      this.group('background');

      this.input('thumbnail_image_id', FileInputView, {
        collection: state.imageFiles,
        positioning: false
      });
    });

    this.tab('options', function() {
      this.group('options');
    });
  }
});
