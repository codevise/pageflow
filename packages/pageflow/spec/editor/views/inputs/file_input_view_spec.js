describe('FileInputView', function() {
  it('can render button to edit background position', function() {
    var fixture = support.factories.videoFileWithTextTrackFiles({
      videoFileAttributes: {perma_id: 5, file_name: 'video.mp4', state: 'encoded'}
    });
    var model = new pageflow.Configuration({
      file_id: 5,
    });

    var fileInputView = new pageflow.FileInputView({
      collection: fixture.videoFiles,
      model: model,
      propertyName: 'file_id',
      positioning: true
    });

    fileInputView.render();
    var dropDownButton = support.dom.DropDownButton.find(fileInputView);

    expect(dropDownButton.menuItemNames()).to.include('edit_background_positioning');
  });

  describe('for selecting a default text track file', function() {
    beforeEach(function() {
      this.fixture = support.factories.videoFileWithTextTrackFiles({
        videoFileAttributes: {perma_id: 5, file_name: 'video.mp4', state: 'encoded'},
        textTrackFilesAttributes: [
          {
            id: 1,
            perma_id: 10,
            configuration: {
              label: 'English'
            }
          },
          {
            id: 2,
            perma_id: 11,
            configuration: {
              label: 'German'
            }
          }
        ]
      });
    });

    it('displays text track files', function() {
      var model = new pageflow.Configuration({
        file_id: 5,
      });

      var fileInputView = new pageflow.FileInputView({
        collection: this.fixture.videoFiles,
        model: model,
        propertyName: 'file_id',
        textTrackFiles: this.fixture.textTrackFiles,
        defaultTextTrackFilePropertyName: 'default_text_track_file_id'
      });

      fileInputView.render();
      var dropDownButton = support.dom.DropDownButton.find(fileInputView);

      expect(dropDownButton.menuItemLabels()).to.include('English');
      expect(dropDownButton.menuItemLabels()).to.include('German');
    });

    it('allows selecting default text track file', function() {
      var model = new pageflow.Configuration({
        file_id: 5,
      });

      var fileInputView = new pageflow.FileInputView({
        collection: this.fixture.videoFiles,
        model: model,
        propertyName: 'file_id',
        textTrackFiles: this.fixture.textTrackFiles,
        defaultTextTrackFilePropertyName: 'default_text_track_file_id'
      });

      fileInputView.render();
      var dropDownButton = support.dom.DropDownButton.find(fileInputView);
      dropDownButton.selectMenuItemByLabel('English');

      expect(model.get('default_text_track_file_id')).to.eq(10);
    });

    it('allows unsetting default text track file', function() {
      var model = new pageflow.Configuration({
        file_id: 5,
        default_text_track_file_id: 10
      });

      var fileInputView = new pageflow.FileInputView({
        collection: this.fixture.videoFiles,
        model: model,
        propertyName: 'file_id',
        textTrackFiles: this.fixture.textTrackFiles,
        defaultTextTrackFilePropertyName: 'default_text_track_file_id'
      });

      fileInputView.render();
      var dropDownButton = support.dom.DropDownButton.find(fileInputView);
      dropDownButton.selectMenuItemByName('no_default_text_track');

      expect(model.get('default_text_track_file_id')).to.eq(null);
    });
  });
});