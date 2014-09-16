describe('FileTypes', function() {
  describe('#setup', function() {
    it('creates file types for given server side configs from registered client side configs', function() {
      var fileTypes = new pageflow.FileTypes();

      fileTypes.register('image_files', {model: pageflow.ImageFile});
      fileTypes.setup([{collectionName: 'image_files'}]);

      expect(fileTypes.first().collectionName).to.eq('image_files');
      expect(fileTypes.first().model).to.eq(pageflow.ImageFile);
    });

    it('throws exception if client side config is missing', function() {
      var fileTypes = new pageflow.FileTypes();

      expect(function() {
        fileTypes.setup([{collectionName: 'image_files'}]);
      }).to.throw(/Missing client side config/);
    });
  });
});