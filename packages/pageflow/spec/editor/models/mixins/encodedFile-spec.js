describe('encodedFile', function() {
  describe('#stages', function() {
    describe('when confirmEncodingJobs is off', function() {
      support.setupGlobals({
        config: {confirmEncodingJobs: false}
      });

      it('does not include fetching meta data', function() {
        var encodedFile = new pageflow.VideoFile();

        expect(encodedFile.stages.pluck('name')).to.deep.eq(['uploading', 'encoding']);
      });
    });

    describe('when confirmEncodingJobs is on', function() {
      support.setupGlobals({
        config: {confirmEncodingJobs: true}
      });

      it('includes fetching meta data', function() {
        var encodedFile = new pageflow.VideoFile();

        expect(encodedFile.stages.pluck('name')).to.deep.eq(
          ['uploading', 'fetching_meta_data', 'encoding']
        );
      });
    });
  });
});