describe('UploadedFile', function() {
  var File = pageflow.UploadedFile.extend({
    readyState: 'ready'
  });

  var FilesCollection = Backbone.Collection.extend({
    model: File
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
        var file = new File({state: 'processing', configuration: {custom: 'seed'}}, {fileType: fileType});
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
    var seed = {nested_files: {text_track_files: [{file_name: 'sample.vtt'}]}};

    beforeEach(function() {
      this.VideoFile = pageflow.UploadedFile.extend({
        readyState: 'ready'
      });
      this.TextTrackFile = pageflow.UploadedFile.extend({
        readyState: 'ready'
      });
      this.ImageFile = pageflow.UploadedFile.extend({
        readyState: 'ready'
      });
      this.textTrackFileType = new pageflow.FileType({collectionName: 'text_track_files',
                                                     model: this.TextTrackFile,
                                                      matchUpload: /^text_track/});
      this.imageFileType = new pageflow.FileType({collectionName: 'image_files',
                                                  model: this.ImageFile,
                                                  matchUpload: /^image/});
      this.videoFileType = new pageflow.FileType({collectionName: 'video_files',
                                                  model: this.VideoFile,
                                                  matchUpload: /^video/});
      this.videoFileType.nestedFileTypes = new pageflow.FileTypesCollection([this.textTrackFileType,
                                                                             this.imageFileType]);
  });

    it('returns a Backbone.Collection', function() {
      var file = new File(seed, {fileType: this.videoFileType});

      expect(file.nestedFiles('text_track_files')).to.be.instanceof(Backbone.Collection);
    });

    it('contains nested files of expected type', function() {
      var file = new File(seed, {fileType: this.videoFileType});

      var nestedFile = file.nestedFiles('text_track_files').first();

      expect(nestedFile.get('file_name')).to.eq('sample.vtt');
    });

    it('returns same backbone collection on repeated call', function() {
      var file = new File(seed, {fileType: this.videoFileType});

      var nestedFileCollection = file.nestedFiles('text_track_files');
      var nestedFileCollection2 = file.nestedFiles('text_track_files');

      expect(nestedFileCollection).to.eq(nestedFileCollection2);
    });

    it('returns different backbone collection for different filetypes', function() {
      var file = new File(seed, {fileType: this.videoFileType});

      var nestedFileCollection = file.nestedFiles('text_track_files');
      var nestedFileCollection2 = file.nestedFiles('image_files');

      expect(nestedFileCollection).not.to.eq(nestedFileCollection2);
    });

    it('contains nested files of expected type', function() {
      var file = new File(seed, {fileType: this.videoFileType});

      var nestedFile = file.nestedFiles('text_track_files').first();

      expect(nestedFile.fileType()).to.eq(this.textTrackFileType);
    });
  });
});
