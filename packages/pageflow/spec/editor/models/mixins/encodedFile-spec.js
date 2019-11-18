import {VideoFile} from '$pageflow/editor';

import * as support from '$support';

describe('encodedFile', () => {
  describe('#stages', () => {
    describe('when confirmEncodingJobs is off', () => {
      support.setupGlobals({
        config: {confirmEncodingJobs: false}
      });

      it('does not include fetching meta data', () => {
        var encodedFile = new VideoFile();

        expect(encodedFile.stages.pluck('name')).toEqual(['uploading', 'encoding']);
      });
    });

    describe('when confirmEncodingJobs is on', () => {
      support.setupGlobals({
        config: {confirmEncodingJobs: true}
      });

      it('includes fetching meta data', () => {
        var encodedFile = new VideoFile();

        expect(encodedFile.stages.pluck('name')).toEqual(['uploading', 'fetching_meta_data', 'encoding']);
      });
    });
  });
});