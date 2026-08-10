import {editor} from 'pageflow-scrolled/editor';

import {LottieFile} from './models/LottieFile';

editor.fileTypes.register('lottie_files', {
  model: LottieFile,

  // Browsers derive the content type of uploads from the file
  // extension. Since dotLottie is missing from their mappings, uploads
  // have an empty content type and matching by name is the only option.
  matchUpload: upload => /\.lottie$/i.test(upload.name)
});
