describe('pageflow.FileProcessingStateDisplayView', function() {
  it('displays unfinished file stages', function() {
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

    expect(support.dom.FileStageItemView.findAll(view).length).to.eq(1);
    expect(view.$el).not.to.have.$class('file_processing_state_display-empty');
  });

  it('does not display finished file stages', function() {
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

    expect(support.dom.FileStageItemView.findAll(view).length).to.eq(0);
    expect(view.$el).to.have.$class('file_processing_state_display-empty');
  });
});
