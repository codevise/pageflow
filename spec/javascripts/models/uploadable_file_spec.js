describe('UploadableFile', function() {
  describe('#processingStages', function() {
    it('is appended to stages', function() {
      var File = pageflow.UploadableFile.extend({
        processingStages: [
          {
            name: 'unpacking',
            activeStates: ['unpacking'],
            failedStates: ['unpacking_failed']
          }
        ]
      });
      var uploadableFile = new File();

      expect(uploadableFile.stages.pluck('name')).to.deep.eq(['uploading', 'unpacking']);
    });

    it('can be a function', function() {
      var File = pageflow.UploadableFile.extend({
        processingStages: function() {
          return [
            {
              name: 'unpacking',
              activeStates: ['unpacking'],
              failedStates: ['unpacking_failed']
            }
          ];
        }
      });
      var uploadableFile = new File();

      expect(uploadableFile.stages.pluck('name')).to.deep.eq(['uploading', 'unpacking']);
    });
  });
});