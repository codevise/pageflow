import {CombinedFilesCollection, FilesCollection, SubsetCollection} from 'pageflow/editor';

import * as support from '$support';

describe('CombinedFilesCollection', () => {
  var f = support.factories;

  function createFileCollections(files) {
    var fileTypes = f.fileTypes(function(builder) {
      builder
        .withImageFileType()
        .withVideoFileType()
        .withTextTrackFileType();
    });

    return FilesCollection.createForFileTypes(fileTypes, files);
  }

  it('contains files of all given collections', () => {
    var collections = createFileCollections({
      image_files: [{id: 1, file_name: 'image.png'}],
      video_files: [{id: 2, file_name: 'video.mp4'}]
    });

    var combinedFiles = new CombinedFilesCollection({
      collections: [collections.image_files, collections.video_files]
    });

    expect(combinedFiles.pluck('file_name')).toEqual(['image.png', 'video.mp4']);
  });

  it('sorts files by file name across collections', () => {
    var collections = createFileCollections({
      image_files: [{id: 1, file_name: 'c.png'}, {id: 2, file_name: 'a.png'}],
      video_files: [{id: 3, file_name: 'b.mp4'}]
    });

    var combinedFiles = new CombinedFilesCollection({
      collections: [collections.image_files, collections.video_files]
    });

    expect(combinedFiles.pluck('file_name')).toEqual(['a.png', 'b.mp4', 'c.png']);
  });

  it('adds file when it is added to one of the collections', () => {
    var collections = createFileCollections({
      image_files: [{id: 1, file_name: 'c.png'}],
      video_files: []
    });
    var combinedFiles = new CombinedFilesCollection({
      collections: [collections.image_files, collections.video_files]
    });

    collections.video_files.add({id: 2, file_name: 'a.mp4'});

    expect(combinedFiles.pluck('file_name')).toEqual(['a.mp4', 'c.png']);
  });

  it('removes file when it is removed from one of the collections', () => {
    var collections = createFileCollections({
      image_files: [{id: 1, file_name: 'image.png'}],
      video_files: [{id: 2, file_name: 'video.mp4'}]
    });
    var combinedFiles = new CombinedFilesCollection({
      collections: [collections.image_files, collections.video_files]
    });

    collections.image_files.remove(collections.image_files.first());

    expect(combinedFiles.pluck('file_name')).toEqual(['video.mp4']);
  });

  it('forwards change events of files', () => {
    var collections = createFileCollections({
      image_files: [{id: 1, file_name: 'image.png'}]
    });
    var combinedFiles = new CombinedFilesCollection({
      collections: [collections.image_files]
    });
    var listener = jest.fn();

    combinedFiles.on('change:state', listener);
    collections.image_files.first().set('state', 'processed');

    expect(listener).toHaveBeenCalled();
  });

  it('does not take over collection of files', () => {
    var collections = createFileCollections({
      image_files: [{id: 1, file_name: 'image.png'}]
    });

    new CombinedFilesCollection({collections: [collections.image_files]});

    expect(collections.image_files.first().collection).toBe(collections.image_files);
  });

  it('throws when a file is looked up by id', () => {
    var collections = createFileCollections({
      image_files: [{id: 1, file_name: 'image.png'}]
    });
    var combinedFiles = new CombinedFilesCollection({
      collections: [collections.image_files]
    });

    expect(() => combinedFiles.get(1)).toThrow(/files of different types can share ids/);
  });

  it('returns undefined when looking up nothing', () => {
    var collections = createFileCollections({
      image_files: [{id: 1, file_name: 'image.png'}]
    });
    var combinedFiles = new CombinedFilesCollection({
      collections: [collections.image_files]
    });

    expect(combinedFiles.get(null)).toBeUndefined();
  });

  describe('with files of equal id in different collections', () => {
    it('contains all files', () => {
      var collections = createFileCollections({
        image_files: [{id: 1, file_name: 'image.png'}],
        video_files: [{id: 1, file_name: 'video.mp4'}]
      });

      var combinedFiles = new CombinedFilesCollection({
        collections: [collections.image_files, collections.video_files]
      });

      expect(combinedFiles.pluck('file_name')).toEqual(['image.png', 'video.mp4']);
    });

    it('contains files added to one of the collections', () => {
      var collections = createFileCollections({
        image_files: [{id: 1, file_name: 'image.png'}],
        video_files: []
      });
      var combinedFiles = new CombinedFilesCollection({
        collections: [collections.image_files, collections.video_files]
      });

      collections.video_files.add({id: 1, file_name: 'video.mp4'});

      expect(combinedFiles.pluck('file_name')).toEqual(['image.png', 'video.mp4']);
    });

    it('looks up files by model', () => {
      var collections = createFileCollections({
        image_files: [{id: 1, file_name: 'image.png'}],
        video_files: [{id: 1, file_name: 'video.mp4'}]
      });
      var videoFile = collections.video_files.first();

      var combinedFiles = new CombinedFilesCollection({
        collections: [collections.image_files, collections.video_files]
      });

      expect(combinedFiles.get(videoFile)).toBe(videoFile);
    });

    it('only removes the file removed from one of the collections', () => {
      var collections = createFileCollections({
        image_files: [{id: 1, file_name: 'image.png'}],
        video_files: [{id: 1, file_name: 'video.mp4'}]
      });
      var combinedFiles = new CombinedFilesCollection({
        collections: [collections.image_files, collections.video_files]
      });

      collections.image_files.remove(collections.image_files.first());

      expect(combinedFiles.pluck('file_name')).toEqual(['video.mp4']);
    });
  });

  describe('with subset collection on top', () => {
    it('keeps files of equal id apart when filter is updated', () => {
      var collections = createFileCollections({
        image_files: [{id: 1, file_name: 'image.png'}],
        video_files: [{id: 1, file_name: 'video.mp4'}]
      });
      var combinedFiles = new CombinedFilesCollection({
        collections: [collections.image_files, collections.video_files]
      });
      var subset = new SubsetCollection({
        parent: combinedFiles,

        filter: function(file) {
          return file.fileType().collectionName === 'image_files';
        }
      });

      subset.updateFilter(function() {
        return true;
      });

      expect(subset.pluck('file_name')).toEqual(['image.png', 'video.mp4']);
    });

    it('removes files removed from one of the collections', () => {
      var collections = createFileCollections({
        image_files: [{id: 1, file_name: 'image.png'}],
        video_files: [{id: 1, file_name: 'video.mp4'}]
      });
      var combinedFiles = new CombinedFilesCollection({
        collections: [collections.image_files, collections.video_files]
      });
      var subset = new SubsetCollection({
        parent: combinedFiles,

        filter: function() {
          return true;
        }
      });

      collections.video_files.remove(collections.video_files.first());

      expect(subset.pluck('file_name')).toEqual(['image.png']);
    });
  });

  describe('#dispose', () => {
    it('stops listening to collections', () => {
      var collections = createFileCollections({
        image_files: [{id: 1, file_name: 'image.png'}]
      });
      var combinedFiles = new CombinedFilesCollection({
        collections: [collections.image_files]
      });

      combinedFiles.dispose();
      collections.image_files.add({id: 2, file_name: 'other.png'});

      expect(combinedFiles.length).toBe(0);
    });
  });
});
