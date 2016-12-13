describe('UploadedFile', function() {
  var File = pageflow.UploadedFile.extend({
    readyState: 'ready'
  });

  var FilesCollection = Backbone.Collection.extend({
    model: File,

    initialize: function(options) {
      options = options || {};
      this.fileType = options.fileType;
    }
  });

  describe('#destroyUsage', function() {
    before(function () {
      this.xhr = sinon.useFakeXMLHttpRequest();
      var requests = this.requests = [];

      this.xhr.onCreate = function (xhr) {
        requests.push(xhr);
      };
    });

    after(function () {
      this.xhr.restore();
    });

    it('deletes file usage via xhr', function() {
      var record = new File({id: 11, usage_id: 12});

      record.destroyUsage();

      expect(this.requests[0].url).to.equal('/editor/file_usages/12');
    });

    it('removes record from containing collection', function () {
      var record = new File({id: 11, usage_id: 12});
      var collection = new FilesCollection();
      collection.add(record);

      record.destroyUsage();

      expect(collection.contains(record)).not.to.be.ok;
    });
  });

  describe('#isReady', function() {
    it('returns true if state equals readyState', function() {
      var file = new File({state: 'ready'});

      expect(file.isReady()).to.eq(true);
    });
  });

  describe('#isFailed', function() {
    it('returns true if state ends with _failed', function() {
      var file = new File({state: 'upload_failed'});

      expect(file.isFailed()).to.eq(true);
    });

    it('returns false if state does not end with _failed', function() {
      var file = new File({state: 'uploading'});

      expect(file.isFailed()).to.eq(false);
    });
  });

  describe('#isPending', function() {
    it('returns true if neither ready nor failed ', function() {
      var file = new File({state: 'processing'});

      expect(file.isPending()).to.eq(true);
    });

    it('returns false if ready', function() {
      var file = new File({state: 'ready'});

      expect(file.isPending()).to.eq(false);
    });

    it('returns false if failed', function() {
      var file = new File({state: 'processing_failed'});

      expect(file.isPending()).to.eq(false);
    });
  });

  describe('#set', function() {
    var f = support.factories;

    describe('with applyConfigurationUpdaters option', function() {
      it('applies file type updaters', function() {
        var fileType = f.fileType({
          configurationUpdaters: [
            function(configuration, newAttributes) {
              configuration.set(newAttributes);
            }
          ]
        });
        var file = new File({state: 'processing', configuration: {custom: 'seed'}},
                            {fileType: fileType});
        var attributes = {configuration: {custom: 'updated'}};

        file.set(attributes, {applyConfigurationUpdaters: true});

        expect(file.configuration.get('custom')).to.eq('updated');
      });
    });
  });

  describe('#toJSON', function() {
    it('includes rights and configuration', function() {
      var file = new File({
        state: 'processed',
        rights: 'someone',
        configuration: {
          some: 'value'
        }
      });

      expect(file.toJSON()).to.eql({
        rights: 'someone',
        configuration: {
          some: 'value'
        }
      });
    });
  });

  describe('#nestedFiles', function() {
    beforeEach(function() {
      this.textTrackFileType = new pageflow.FileType({collectionName: 'text_track_files',
                                                      typeName: 'Pageflow::TextTrackFile',
                                                      model: File,
                                                      matchUpload: /^text_track/});
      this.imageFileType = new pageflow.FileType({collectionName: 'image_files',
                                                  typeName: 'Pageflow::ImageFile',
                                                  model: File,
                                                  matchUpload: /^image/});
      this.videoFileType = new pageflow.FileType({collectionName: 'video_files',
                                                  typeName: 'Pageflow::VideoFile',
                                                  model: File,
                                                  matchUpload: /^video/});
      this.videoFileType.nestedFileTypes = new pageflow.FileTypesCollection([this.textTrackFileType,
                                                                             this.imageFileType]);
      this.textTrackFiles = new FilesCollection({fileType: this.textTrackFileType});
      this.imageFiles = new FilesCollection({fileType: this.imageFileType});
    });

    it('returns a SubsetCollection', function() {
      var parentFile = new File({}, {fileType: this.videoFileType});
      var nestedFile = new File({}, {fileType: this.textTrackFileType, parentFile: parentFile});
      this.textTrackFiles.add(nestedFile);

      expect(parentFile.nestedFiles(this.textTrackFiles))
        .to.be.instanceof(pageflow.SubsetCollection);
    });

    it('contains nested files of expected type', function() {
      var parentFile = new File({id: 43}, {fileType: this.videoFileType});
      var otherNestedFile = new File({file_name: 'not_nested.vtt'},
                                     {fileType: this.textTrackFileType});
      var nestedFile = new File({parent_file_id: parentFile.id,
                                 parent_file_model_type: 'Pageflow::VideoFile',
                                 file_name: 'nested.vtt'},
                                {fileType: this.textTrackFileType, parentFile: parentFile});
      this.textTrackFiles.add(otherNestedFile);
      this.textTrackFiles.add(nestedFile);

      var nestedFilesViaParent = parentFile.nestedFiles(this.textTrackFiles);
      var nestedFileViaParent = nestedFilesViaParent.first();

      expect(nestedFilesViaParent.length).to.eq(1);
      expect(nestedFileViaParent.get('file_name')).to.eq('nested.vtt');
    });

    it('returns same collection on repeated call', function() {
      var parentFile = new File({id: 43}, {fileType: this.videoFileType});
      var nestedFile = new File({parent_file_id: parentFile.id,
                                 parent_file_model_type: 'Pageflow::VideoFile',
                                 file_name: 'nested.vtt'},
                                {fileType: this.textTrackFileType, parentFile: parentFile});
      this.textTrackFiles.add(nestedFile);

      var nestedFileCollection = parentFile.nestedFiles(this.textTrackFiles);
      var nestedFileCollection2 = parentFile.nestedFiles(this.textTrackFiles);

      expect(nestedFileCollection).to.eq(nestedFileCollection2);
    });

    it('returns different backbone collection for different filetypes', function() {
      var parentFile = new File({id: 43}, {fileType: this.videoFileType});
      var nestedTextTrackFile = new File({parent_file_id: parentFile.id,
                                          parent_file_model_type: 'Pageflow::VideoFile',
                                          file_name: 'nested.vtt'},
                                         {fileType: this.textTrackFileType,
                                          parentFile: parentFile});
      var nestedImageFile = new File({parent_file_id: parentFile.id,
                                      parent_file_model_type: 'Pageflow::ImageFile',
                                      file_name: 'nested.tiff'},
                                     {fileType: this.textTrackFileType, parentFile: parentFile});
      this.textTrackFiles.add(nestedTextTrackFile);
      this.imageFiles.add(nestedImageFile);

      var nestedFileCollection = parentFile.nestedFiles(this.textTrackFiles);
      var nestedFileCollection2 = parentFile.nestedFiles(this.imageFiles);

      expect(nestedFileCollection).not.to.eq(nestedFileCollection2);
    });

    it('contains nested files of expected type', function() {
      var parentFile = new File({id: 43}, {fileType: this.videoFileType});
      var nestedFile = new File({parent_file_id: parentFile.id,
                                 parent_file_model_type: 'Pageflow::VideoFile',
                                 file_name: 'nested.vtt'},
                                {fileType: this.textTrackFileType, parentFile: parentFile});
      this.textTrackFiles.add(nestedFile);

      var nestedFileViaParent = parentFile.nestedFiles(this.textTrackFiles).first();

      expect(nestedFileViaParent.fileType()).to.eq(this.textTrackFileType);
    });

    it('does not contains nested files of other file with same id but different type', function() {
      var parentFile = new File({id: 43}, {fileType: this.videoFileType});
      var nestedFile = new File({parent_file_id: parentFile.id,
                                 parent_file_model_type: 'Pageflow::AudioFile',
                                 file_name: 'nested.vtt'},
                                {fileType: this.textTrackFileType, parentFile: parentFile});
      this.textTrackFiles.add(nestedFile);

      var nestedFilesCount = parentFile.nestedFiles(this.textTrackFiles).length;

      expect(nestedFilesCount).to.eq(0);
    });
  });
});
