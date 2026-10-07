import {OtherEntry, TextTracksFileMetaDataItemValueView} from 'pageflow/editor';

import * as support from '$support';

describe('TextTracksFileMetaDataItemValueView', () => {
  let testContext;

  beforeEach(() => {
    testContext = {};
  });

  beforeEach(() => {
    testContext.fixture = support.factories.videoFileWithTextTrackFiles({
      textTrackFilesAttributes: [
        {configuration: {label: 'English'}},
        {configuration: {label: 'German'}}
      ]
    });
  });

  support.setupGlobals({
    textTrackFiles: function() { return testContext.fixture.textTrackFiles; }
  });

  it('renders a comman separated list of text track labels', () => {
    var view = new TextTracksFileMetaDataItemValueView({
      model: testContext.fixture.videoFile
    });

    view.render();

    expect(view.$el.text()).toContain('English');
  });

  it('renders text tracks of other entry for files of other entry', () => {
    const fileTypes = support.factories.fileTypes(function() {
      this.withVideoFileType();
      this.withTextTrackFileType();
    });
    const videoFileType = fileTypes.findByCollectionName('video_files');
    const textTrackFileType = fileTypes.findByCollectionName('text_track_files');
    const otherEntry = new OtherEntry({id: 2}, {fileTypes});

    otherEntry.getFileCollection(videoFileType).set([{id: 1}], {fileType: videoFileType});
    otherEntry.getFileCollection(textTrackFileType).set([{
      parent_file_id: 1,
      parent_file_model_type: 'Pageflow::VideoFile',
      configuration: {label: 'French'}
    }], {fileType: textTrackFileType});

    var view = new TextTracksFileMetaDataItemValueView({
      model: otherEntry.getFileCollection(videoFileType).first()
    });

    view.render();

    expect(view.$el.text()).toContain('French');
    expect(view.$el.text()).not.toContain('English');
  });
});
