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
    textTrackFiles: function() { return this.fixture.textTrackFiles; }
  });

  test('renders a comman separated list of text track labels', () => {
    var view = new pageflow.TextTracksFileMetaDataItemValueView({
      model: testContext.fixture.videoFile
    });

    view.render();

    expect(view.$el.text()).toEqual(expect.arrayContaining(['English']));
  });
});