describe('UploadableFile', () => {
  describe('#processingStages', () => {
    test('is appended to stages', () => {
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

      expect(uploadableFile.stages.pluck('name')).toEqual(['uploading', 'unpacking']);
    });

    test('can be a function', () => {
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

      expect(uploadableFile.stages.pluck('name')).toEqual(['uploading', 'unpacking']);
    });
  });
});