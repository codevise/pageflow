describe('FileUploader', function() {
  beforeEach(function() {
    this.fileTypes = support.factories
      .fileTypesWithImageFileType({addVideoAndTextTrackFileTypes: true});
    this.imageFileType = this.fileTypes.findByCollectionName('image_files');
    this.videoFileType = this.fileTypes.findByCollectionName('video_files');
    this.textTrackFileType = this.fileTypes.findByCollectionName('text_track_files');

    this.entry = support.factories.entry({}, {
      files: {
        image_files: new Backbone.Collection(),
        video_files: new Backbone.Collection(),
        text_track_files: new Backbone.Collection()
      },
      fileTypes: this.fileTypes
    });
  });

  describe('#add', function() {
    describe('non-nested file', function() {
      it('adds file to files collection of file type', function() {
        var fileUploader = new pageflow.FileUploader({
          entry: this.entry,
          fileTypes: this.fileTypes
        });
        var upload = {name: 'image.png', type: 'image/png'};

        fileUploader.add(upload);

        expect(this.entry.getFileCollection(this.imageFileType).length).to.eq(1);
      });

      it('returns promise that resolves to file when FileUploader#submit is called', function() {
        var fileUploader = new pageflow.FileUploader({
          entry: this.entry,
          fileTypes: this.fileTypes
        });
        var upload = {name: 'image.png', type: 'image/png'};
        var result;

        fileUploader.add(upload).then(function(file) {
          result = file;
        });
        fileUploader.submit();

        expect(result).to.be.instanceof(pageflow.ImageFile);
      });

      it('returns promise that is rejected when FileUploader#abort is called', function() {
        var fileUploader = new pageflow.FileUploader({
          entry: this.entry,
          fileTypes: this.fileTypes
        });
        var upload = {name: 'image.png', type: 'image/png'};

        var promise = fileUploader.add(upload);
        fileUploader.abort();

        expect(promise.state()).to.eql('rejected');
      });

      it('emits new:batch event on first add', function() {
        var fileUploader = new pageflow.FileUploader({
          entry: this.entry,
          fileTypes: this.fileTypes
        });
        var upload = {name: 'image.png', type: 'image/png'};
        var handler = sinon.spy();

        fileUploader.on('new:batch', handler);
        fileUploader.add(upload);
        fileUploader.add(upload);

        expect(handler).to.have.been.calledOnce;
      });

      it('emits new:batch event on first add after abort', function() {
        var fileUploader = new pageflow.FileUploader({
          entry: this.entry,
          fileTypes: this.fileTypes
        });
        var upload = {name: 'image.png', type: 'image/png'};
        var handler = sinon.spy();

        fileUploader.on('new:batch', handler);
        fileUploader.add(upload);
        fileUploader.abort();
        fileUploader.add(upload);

        expect(handler).to.have.been.calledTwice;
      });

      it('emits new:batch event on first add after submit', function() {
        var fileUploader = new pageflow.FileUploader({
          entry: this.entry,
          fileTypes: this.fileTypes
        });
        var upload = {name: 'image.png', type: 'image/png'};
        var handler = sinon.spy();

        fileUploader.on('new:batch', handler);
        fileUploader.add(upload);
        fileUploader.submit();
        fileUploader.add(upload);

        expect(handler).to.have.been.calledTwice;
      });
    });

    describe('nested file', function() {
      it('adds file to nested files collection of file type on target file', function() {
        var fileUploader = new pageflow.FileUploader({
          entry: this.entry,
          fileTypes: this.fileTypes
        });
        var targetFileUpload = {name: 'video.mp4', type: 'video/mp4'};
        pageflow.config = {confirmEncodingJobs: false};
        fileUploader.add(targetFileUpload);
        fileUploader.submit();
        var targetFile = this.entry.getFileCollection(this.videoFileType).first();
        var nestedFileUpload = {name: 'text_track.vtt', type: 'text/vtt'};
        var editor = new pageflow.EditorApi();
        editor.setUploadTargetFile(targetFile);
        fileUploader.add(nestedFileUpload, {editor: editor});
        sinon.stub(this.entry, 'getFileCollection').withArgs(this.textTrackFileType)
          .returns(new pageflow.FilesCollection.createForFileType(this.textTrackFileType,
                                                                  {},
                                                                  {entry: this.entry,
                                                                   parentFile: targetFile}));
        expect(editor.nextUploadTargetFile.nestedFiles(
          this.entry.getFileCollection(this.textTrackFileType)
        ).length).to.eq(1);
      });

      it('resolves to file without the need to call any external function', function() {
        var fileUploader = new pageflow.FileUploader({
          entry: this.entry,
          fileTypes: this.fileTypes
        });
        var targetFileUpload = {name: 'video.mp4', type: 'video/mp4'};
        pageflow.config = {confirmEncodingJobs: false};
        fileUploader.add(targetFileUpload);
        fileUploader.submit();
        var targetFile = this.entry.getFileCollection(this.videoFileType).first();
        var nestedFileUpload = {name: 'text_track.vtt', type: 'text/vtt'};
        var editor = new pageflow.EditorApi();
        editor.setUploadTargetFile(targetFile);
        var result;
        fileUploader.add(nestedFileUpload, {editor: editor}).then(function(file) {
          result = file;
        });
        expect(result).to.be.instanceof(pageflow.TextTrackFile);
      });
    });
  });

  describe('#abort', function() {
    it('removes the files from the files collection', function() {
      var fileUploader = new pageflow.FileUploader({
        entry: this.entry,
        fileTypes: this.fileTypes
      });
      var upload = {name: 'image.png', type: 'image/png'};

      fileUploader.add(upload);
      fileUploader.abort();

      expect(this.entry.getFileCollection(this.imageFileType).length).to.eq(0);
    });
  });
});
