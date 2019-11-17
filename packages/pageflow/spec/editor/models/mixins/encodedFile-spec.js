describe('encodedFile', () => {
  describe('#stages', () => {
    describe('when confirmEncodingJobs is off', () => {
      support.setupGlobals({
        config: {confirmEncodingJobs: false}
      });

      test('does not include fetching meta data', () => {
        var encodedFile = new pageflow.VideoFile();

        expect(encodedFile.stages.pluck('name')).toEqual(['uploading', 'encoding']);
      });
    });

    describe('when confirmEncodingJobs is on', () => {
      support.setupGlobals({
        config: {confirmEncodingJobs: true}
      });

      test('includes fetching meta data', () => {
        var encodedFile = new pageflow.VideoFile();

        expect(encodedFile.stages.pluck('name')).toEqual(['uploading', 'fetching_meta_data', 'encoding']);
      });
    });
  });
});