describe('Entry', function() {
  beforeEach(function() {
    pageflow.editor = new pageflow.EditorApi();

    pageflow.editor.fileTypes.register('image_files', {
      model: pageflow.ImageFile,
      matchUpload: /^image/
    });

    pageflow.editor.fileTypes.setup([{
      collectionName: 'image_files',
      typeName: 'Pageflow::ImageFile'
    }]);
    this.imageFileType = pageflow.editor.fileTypes.first();
  });

  describe('#addFileUsage', function() {
    support.useFakeXhr();

    it('posts file usage to server', function() {
      var imageFiles = pageflow.FilesCollection.createForFileType(this.imageFileType, [{id: '12'}]);
      var entry = buildEntry({id: 1}, {
        storylines: new Backbone.Collection(),
        chapters: new Backbone.Collection(),
        files: {
          image_files: new Backbone.Collection()
        }
      });
      var file = imageFiles.first();

      entry.addFileUsage(file);

      expect(this.requests[0].url).to.eq('/editor/entries/1/file_usages');
      expect(JSON.parse(this.requests[0].requestBody)).to.deep.eq({
        file_usage: {
          file_id: '12',
          file_type: 'Pageflow::ImageFile'
        }
      });
    });

    it('adds file to files collection on success', function() {
      var imageFiles = pageflow.FilesCollection.createForFileType(this.imageFileType, [{}]);
      var entry = buildEntry({id: 1}, {
        files: {
          image_files: new Backbone.Collection()
        }
      });
      var file = imageFiles.first();

      this.server.respondWith('POST', '/editor/entries/1/file_usages',
                              [200, {'Content-Type': 'application/json'}, '{"id": 234}']);

      entry.addFileUsage(file);
      this.server.respond();

      expect(file.get('usage_id')).to.eq(234);
      expect(entry.getFileCollection(this.imageFileType).first()).to.eq(file);
    });
  });

  describe('#parse', function() {
    it('updates files in files collections', function() {
      var entry = buildEntry({id: 1}, {
        files: {
          image_files: pageflow.FilesCollection.createForFileType(this.imageFileType,
                                                                  [{id: 12, state: 'uploading'}])
        }
      });

      entry.parse({
        image_files: [{id: 12, state: 'processed'}]
      });

      expect(entry.getFileCollection(this.imageFileType).first().get('state')).to.eq('processed');
    });
  });

  describe('file collection count attribute', function() {
    it('is kept for each registed file type', function() {
      var entry = buildEntry({}, {
        files: {
          image_files: new Backbone.Collection()
        }
      });

      entry.getFileCollection(this.imageFileType).add(new pageflow.ImageFile({state: 'processing'}));

      expect(entry.get('pending_image_files_count')).to.eq(1);
    });
  });

  function buildEntry(attributes, options) {
    return new pageflow.Entry(attributes, _.extend({
      storylines: new Backbone.Collection(),
      chapters: new Backbone.Collection()
    }, options));
  }
});