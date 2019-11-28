import {EncodedFile} from './EncodedFile';

export const AudioFile = EncodedFile.extend({
  thumbnailPictogram: 'audio',

  getSources: function(attribute) {
    if (this.isReady()) {
      return this.get('sources') ? this.get('sources') : '';
    }

    return '';
  },
});
