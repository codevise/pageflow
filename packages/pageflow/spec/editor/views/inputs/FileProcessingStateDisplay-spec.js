describe('pageflow.FileProcessingStateDisplayView', () => {
  test('displays unfinished file stages', () => {
    var fixture = support.factories.imageFilesFixture({
      imageFileAttributes: {
        id: 1,
        perma_id: 5,
        state: 'processing'
      }
    });
    var model = new pageflow.Configuration({
      imageFileId: 5
    });
    var view = new pageflow.FileProcessingStateDisplayView({
      collection: fixture.imageFiles,
      propertyName: 'imageFileId',
      model: model
    });

    view.render();

    expect(support.dom.FileStageItemView.findAll(view).length).toBe(1);
    expect(view.$el).not.to.have.$class('file_processing_state_display-empty');
  });

  test('does not display finished file stages', () => {
    var fixture = support.factories.imageFilesFixture({
      imageFileAttributes: {
        id: 1,
        perma_id: 5,
        state: 'processed'
      }
    });
    var model = new pageflow.Configuration({
      imageFileId: 5
    });
    var view = new pageflow.FileProcessingStateDisplayView({
      collection: fixture.imageFiles,
      propertyName: 'imageFileId',
      model: model
    });

    view.render();

    expect(support.dom.FileStageItemView.findAll(view).length).toBe(0);
    expect(view.$el).to.have.$class('file_processing_state_display-empty');
  });
});
