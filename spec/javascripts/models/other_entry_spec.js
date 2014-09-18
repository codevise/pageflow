describe('OtherEntry', function() {
  beforeEach(function() {
    pageflow.editor = new pageflow.EditorApi();

    pageflow.editor.fileTypes.register('image_files', {
      model: pageflow.ImageFile,
      matchUpload: /^image/
    });

    pageflow.editor.fileTypes.setup([{
      collectionName: 'image_files',
      typeName: 'Pageflow::ImageFile'
    }]);
    this.imageFileType = pageflow.editor.fileTypes.first();
  });

  describe('#getFileCollection', function() {
    it('returns file collection for entry by fileType', function() {
      var entry = new pageflow.OtherEntry({id: 34});

      var collection = entry.getFileCollection(this.imageFileType);

      expect(collection.url()).to.eq('/editor/entries/34/files/image_files');
    });
  });
});