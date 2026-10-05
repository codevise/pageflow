import {OtherEntry} from 'pageflow/editor';

import * as support from '$support';

describe('OtherEntry', () => {
  describe('#getFileCollection', () => {
    it('returns file collection for entry by fileType', () => {
      var entry = new OtherEntry({id: 34});
      var imageFileType = support.factories.imageFileType();

      var collection = entry.getFileCollection(imageFileType);

      expect(collection.url()).toBe('/editor/entries/34/files/image_files');
    });
  });

  describe('#fetchFiles', () => {
    let testContext;

    beforeEach(() => {
      testContext = {};
    });

    support.useFakeXhr(() => testContext);

    function fileTypes() {
      return support.factories.fileTypes(function() {
        this.withImageFileType();
        this.withVideoFileType();
        this.withTextTrackFileType();
      });
    }

    function respondWith(body) {
      testContext.server.respondWith('GET', '/editor/entries/34/files',
                                     [200, {'Content-Type': 'application/json'},
                                      JSON.stringify(body)]);
    }

    it('fills file collections of all file types', async () => {
      const types = fileTypes();
      const entry = new OtherEntry({id: 34}, {fileTypes: types});
      respondWith({
        image_files: [{id: 1, file_name: 'image.png'}],
        video_files: [{id: 2, file_name: 'video.mp4'}]
      });

      const promise = entry.fetchFiles();
      testContext.server.respond();
      await promise;

      expect(entry.getFileCollection(types.findByCollectionName('image_files')).pluck('id'))
        .toEqual([1]);
      expect(entry.getFileCollection(types.findByCollectionName('video_files')).pluck('id'))
        .toEqual([2]);
    });

    it('passes file type to file models', async () => {
      const types = fileTypes();
      const imageFileType = types.findByCollectionName('image_files');
      const entry = new OtherEntry({id: 34}, {fileTypes: types});
      respondWith({image_files: [{id: 1}], video_files: []});

      const promise = entry.fetchFiles();
      testContext.server.respond();
      await promise;

      expect(entry.getFileCollection(imageFileType).first().fileType()).toBe(imageFileType);
    });

    it('keeps collections empty for file types missing in response', async () => {
      const types = fileTypes();
      const entry = new OtherEntry({id: 34}, {fileTypes: types});
      respondWith({image_files: [{id: 1}]});

      const promise = entry.fetchFiles();
      testContext.server.respond();
      await promise;

      expect(entry.getFileCollection(types.findByCollectionName('video_files')).length)
        .toBe(0);
    });
  });
});
