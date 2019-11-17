describe('Entry', function() {
  beforeEach(function() {
    this.fileTypes = support.factories.fileTypesWithImageFileType();
    this.imageFileType = this.fileTypes.first();

    this.buildEntry = function(attributes, options) {
      return support.factories.entry(attributes, _.extend({
        fileTypes: this.fileTypes
      }, options));
    };
  });

  describe('#getFileCollection', function() {
    it('supports looking up via fileType object', function() {
      var imageFiles = pageflow.FilesCollection.createForFileType(this.imageFileType, []);
      var entry = this.buildEntry({}, {
        files: {
          image_files: imageFiles
        }
      });

      var result = entry.getFileCollection(this.imageFileType);

      expect(result).to.eq(imageFiles);
    });

    it('supports looking up via fileType collection name', function() {
      var imageFiles = pageflow.FilesCollection.createForFileType(this.imageFileType, []);
      var entry = this.buildEntry({}, {
        files: {
          image_files: imageFiles
        }
      });

      var result = entry.getFileCollection(this.imageFileType.collectionName);

      expect(result).to.eq(imageFiles);
    });
  });

  describe('#reuseFile', function() {
    support.useFakeXhr();

    it('posts file usage to server', function() {
      var imageFiles = pageflow.FilesCollection.createForFileType(this.imageFileType, [{id: 12}]);
      var entry = this.buildEntry({id: 1}, {
        files: {
          image_files: new Backbone.Collection()
        }
      });
      var otherEntry = this.buildEntry({id: 2}, {
        files: {
          image_files: new Backbone.Collection()
        }
      });
      var file = imageFiles.first();

      entry.reuseFile(otherEntry, file);

      expect(this.requests[0].url).to.eq('/editor/entries/1/files/image_files/reuse');
      expect(JSON.parse(this.requests[0].requestBody)).to.deep.eq({
        file_reuse: {
          file_id: 12,
          other_entry_id: 2
        }
      });
    });

    it('adds file to files collection on success', function() {
      var entry = this.buildEntry({id: 1}, {
        files: {
          image_files: pageflow.FilesCollection.createForFileType(this.imageFileType, [])
        }
      });
      var imageFiles = pageflow.FilesCollection.createForFileType(this.imageFileType, [{}]);
      var otherEntry = this.buildEntry({id: 2}, {
        files: {
          image_files: imageFiles
        }
      });
      var file = imageFiles.first();

      this.server.respondWith('POST', '/editor/entries/1/files/image_files/reuse',
                              [200, {'Content-Type': 'application/json'}, JSON.stringify({
                                image_files: [{id: 234}]
                              })]);

      entry.reuseFile(otherEntry, file);
      this.server.respond();

      var imageFile = entry.getFileCollection(this.imageFileType).first();

      expect(imageFile.id).to.eq(234);
      expect(imageFile.fileType()).to.eq(this.imageFileType);
    });
  });

  describe('#parse', function() {
    it('updates files in files collections', function() {
      var entry = this.buildEntry({id: 1}, {
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
      var entry = this.buildEntry({}, {
        files: {
          image_files: new Backbone.Collection()
        }
      });

      entry.getFileCollection(this.imageFileType).add(new pageflow.ImageFile({state: 'processing'}));

      expect(entry.get('pending_image_files_count')).to.eq(1);
    });
  });

  describe('#getTheme', function() {
    it('returns theme based on theme_name configuration attribute', function() {
      var themes = new pageflow.ThemesCollection([
        {
          name: 'custom',
          page_change_by_scrolling: true
        }
      ]);
      var entry = support.factories.entry(
        {
          configuration: {theme_name: 'custom'}
        },
        {
          themes: themes
        }
      );

      var result = entry.getTheme();

      expect(result).to.eq(themes.first());
    });
  });
});
