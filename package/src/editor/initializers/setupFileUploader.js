import {FileUploader} from '../models/FileUploader';
import {app} from '../app';
import {editor} from '../base';

import {ConfirmUploadView} from '../views/ConfirmUploadView';

import {state} from '$state';

app.addInitializer(function(options) {
  state.fileUploader = new FileUploader({
    entry: state.entry,
    fileTypes: editor.fileTypes
  });

  ConfirmUploadView.watch(state.fileUploader,
                                   editor.fileTypes,
                                   state.files);
});
