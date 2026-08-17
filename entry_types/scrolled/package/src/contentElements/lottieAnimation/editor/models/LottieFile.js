import {UploadableFile} from 'pageflow/editor';

export const LottieFile = UploadableFile.extend({
  isPositionable: function() {
    return this.isReady();
  }
});
