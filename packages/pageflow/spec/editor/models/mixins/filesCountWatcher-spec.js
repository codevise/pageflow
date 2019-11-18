import Backbone from 'backbone';

import {FilesCollection, ReusableFile, filesCountWatcher} from '$pageflow/editor';

describe('filesCountWatcher', () => {
  var Model = Backbone.Model.extend({
    mixins: [filesCountWatcher]
  });

  var FileModel = ReusableFile.extend({
    readyState: 'processed'
  });

  function createFilesCollection(items) {
    return new FilesCollection(items, {
      model: FileModel,
      fileType: {
        collectionName: 'image_files'
      }
    });
  }

  it('initializes uploading files count', () => {
    var record = new Model();

    record.imageFiles = createFilesCollection([
      {state: 'uploading'},
      {state: 'processed'}
    ]);
    record.watchFileCollection('image_files', record.imageFiles);

    expect(record.get('uploading_image_files_count')).toBe(1);
  });

  it('initializes pending files count', () => {
    var record = new Model();

    record.imageFiles = createFilesCollection([
      {state: 'processing'},
      {state: 'processed'}
    ]);
    record.watchFileCollection('image_files', record.imageFiles);

    expect(record.get('pending_image_files_count')).toBe(1);
  });

  it('updates uploading files count when file state changes', () => {
    var record = new Model();

    record.imageFiles = createFilesCollection([
      {state: 'uploading'},
      {state: 'processed'}
    ]);
    record.watchFileCollection('image_files', record.imageFiles);
    record.imageFiles.first().set('state', 'processing');

    expect(record.get('uploading_image_files_count')).toBe(0);
  });

  it('updates pending files count when file state changes', () => {
    var record = new Model();

    record.imageFiles = createFilesCollection([
      {state: 'processing'},
      {state: 'processed'}
    ]);
    record.watchFileCollection('image_files', record.imageFiles);
    record.imageFiles.first().set('state', 'processed');

    expect(record.get('pending_image_files_count')).toBe(0);
  });

  it('updates uploading files count when adding a file', () => {
    var record = new Model();

    record.imageFiles = createFilesCollection();
    record.watchFileCollection('image_files', record.imageFiles);
    record.imageFiles.add({state: 'uploading'});

    expect(record.get('uploading_image_files_count')).toBe(1);
  });

  it('updates uploading files count when removing a file', () => {
    var record = new Model();

    record.imageFiles = createFilesCollection([
      {state: 'uploading'},
      {state: 'uploading'}
    ]);
    record.watchFileCollection('image_files', record.imageFiles);
    record.imageFiles.first().destroy();

    expect(record.get('uploading_image_files_count')).toBe(1);
  });

  it(
    'updates uploading_files_count to sum of uploading files counts',
    () => {
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

      expect(record.get('uploading_files_count')).toBe(3);
    }
  );
});
