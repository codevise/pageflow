describe('filesCountWatcher', function() {
  var Model = Backbone.Model.extend({
    mixins: [pageflow.filesCountWatcher]
  });

  var FileModel = pageflow.ReusableFile.extend({
    readyState: 'processed'
  });

  function createFilesCollection(items) {
    return new pageflow.FilesCollection(items, {
      model: FileModel,
      fileType: {
        collectionName: 'image_files'
      }
    });
  }

  it('initializes uploading files count', function() {
    var record = new Model();

    record.imageFiles = createFilesCollection([
      {state: 'uploading'},
      {state: 'processed'}
    ]);
    record.watchFileCollection('image_files', record.imageFiles);

    expect(record.get('uploading_image_files_count')).to.eq(1);
  });

  it('initializes pending files count', function() {
    var record = new Model();

    record.imageFiles = createFilesCollection([
      {state: 'processing'},
      {state: 'processed'}
    ]);
    record.watchFileCollection('image_files', record.imageFiles);

    expect(record.get('pending_image_files_count')).to.eq(1);
  });

  it('updates uploading files count when file state changes', function() {
    var record = new Model();

    record.imageFiles = createFilesCollection([
      {state: 'uploading'},
      {state: 'processed'}
    ]);
    record.watchFileCollection('image_files', record.imageFiles);
    record.imageFiles.first().set('state', 'processing');

    expect(record.get('uploading_image_files_count')).to.eq(0);
  });

  it('updates pending files count when file state changes', function() {
    var record = new Model();

    record.imageFiles = createFilesCollection([
      {state: 'processing'},
      {state: 'processed'}
    ]);
    record.watchFileCollection('image_files', record.imageFiles);
    record.imageFiles.first().set('state', 'processed');

    expect(record.get('pending_image_files_count')).to.eq(0);
  });

  it('updates uploading files count when adding a file', function() {
    var record = new Model();

    record.imageFiles = createFilesCollection();
    record.watchFileCollection('image_files', record.imageFiles);
    record.imageFiles.add({state: 'uploading'});

    expect(record.get('uploading_image_files_count')).to.eq(1);
  });

  it('updates uploading files count when removing a file', function() {
    var record = new Model();

    record.imageFiles = createFilesCollection([
      {state: 'uploading'},
      {state: 'uploading'}
    ]);
    record.watchFileCollection('image_files', record.imageFiles);
    record.imageFiles.first().destroy();

    expect(record.get('uploading_image_files_count')).to.eq(1);
  });

  it('updates uploading_files_count to sum of uploading files counts', function() {
    var record = new Model();

    record.imageFiles = createFilesCollection([
      {state: 'uploading'},
      {state: 'uploading'}
    ]);
    record.videoFiles = createFilesCollection([
      {state: 'uploading'}
    ]);
    record.watchFileCollection('image_files', record.imageFiles);
    record.watchFileCollection('video_files', record.videoFiles);

    expect(record.get('uploading_files_count')).to.eq(3);
  });
});
