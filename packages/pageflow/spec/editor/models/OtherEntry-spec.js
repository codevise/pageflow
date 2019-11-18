import {OtherEntry} from '$pageflow/editor';

import * as support from '$support';

describe('OtherEntry', () => {
  describe('#getFileCollection', () => {
    test('returns file collection for entry by fileType', () => {
      var entry = new OtherEntry({id: 34});
      var imageFileType = support.factories.imageFileType();

      var collection = entry.getFileCollection(imageFileType);

      expect(collection.url()).toBe('/editor/entries/34/files/image_files');
    });
  });
});