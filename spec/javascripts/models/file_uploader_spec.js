describe('FileUploader', function() {
  beforeEach(function() {
    this.fileTypes = new pageflow.FileTypes();

    this.fileTypes.register('image_files', {
      model: pageflow.ImageFile,
      matchUpload: /^image/
    });

    this.fileTypes.setup([{
      collectionName: 'image_files',
      typeName: 'Pageflow::ImageFile'
    }]);

    this.imageFileType = this.fileTypes.first();

    this.entry = buildEntry({}, {
      files: {
        image_files: new Backbone.Collection()
      }
    });
  });

  describe('#add', function() {
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

  function buildEntry(attributes, options) {
    return new pageflow.Entry(attributes, _.extend({
      storylines: new Backbone.Collection(),
      chapters: new Backbone.Collection()
    }, options));
  }
});