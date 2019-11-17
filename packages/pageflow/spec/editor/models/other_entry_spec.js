describe('OtherEntry', function() {
  describe('#getFileCollection', function() {
    it('returns file collection for entry by fileType', function() {
      var entry = new pageflow.OtherEntry({id: 34});
      var imageFileType = support.factories.imageFileType();

      var collection = entry.getFileCollection(imageFileType);

      expect(collection.url()).to.eq('/editor/entries/34/files/image_files');
    });
  });
});