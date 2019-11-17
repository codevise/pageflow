describe('TextTracksFileMetaDataItemValueView', function() {
  beforeEach(function() {
    this.fixture = support.factories.videoFileWithTextTrackFiles({
      textTrackFilesAttributes: [
        {configuration: {label: 'English'}},
        {configuration: {label: 'German'}}
      ]
    });
  });

  support.setupGlobals({
    textTrackFiles: function() { return this.fixture.textTrackFiles; }
  });

  it('renders a comman separated list of text track labels', function() {
    var view = new pageflow.TextTracksFileMetaDataItemValueView({
      model: this.fixture.videoFile
    });

    view.render();

    expect(view.$el.text()).to.include('English');
  });
});