describe('Page', function() {
  describe('#thumbnailFile', function() {
    support.setupGlobals({
      editor: function() {
        var api = new pageflow.EditorApi();

        api.pageTypes.register('audio', {});
        api.pageTypes.setup([
          {
            name: 'video',
            thumbnail_candidates: [
              {
                attribute: 'thumbnail_id',
                file_collection: 'image_files',
              },
              {
                attribute: 'image_id',
                file_collection: 'image_files',
                condition: {
                  attribute: 'background_type',
                  value: 'image'
                }
              },
              {
                attribute: 'poster_id',
                file_collection: 'image_files',
                condition: {
                  attribute: 'background_type',
                  value: 'image',
                  negated: true
                }
              }
            ]
          }
        ]);

        return api;
      },

      entry: function() {
        pageflow.editor.fileTypes = support.factories.fileTypes(function() {
          this.withImageFileType();
        });

        return support.factories.entry({}, {
          fileTypes: pageflow.editor.fileTypes,
          files: pageflow.FilesCollection.createForFileTypes(
            pageflow.editor.fileTypes,
            {
              image_files: [
                {id: 1, perma_id: 5},
                {id: 2, perma_id: 6}
              ]
            }
          )
        });
      }
    });

    it('returns first present file', function() {
      var page = new pageflow.Page({
        template: 'video',
        configuration: {
          thumbnail_id: 5
        }
      });

      var thumbnailFile = page.thumbnailFile();

      expect(thumbnailFile.get('perma_id')).to.eq(5);
    });

    it('returns undefined if no candidate matches', function() {
      var page = new pageflow.Page({
        template: 'video',
        configuration: {}
      });

      var thumbnailFile = page.thumbnailFile();

      expect(thumbnailFile).to.eq(undefined);
    });

    it('returns undefined if candidate condition is not met', function() {
      var page = new pageflow.Page({
        template: 'video',
        configuration: {
          image_id: 5,
          background_type: 'video'
        }
      });

      var thumbnailFile = page.thumbnailFile();

      expect(thumbnailFile).to.eq(undefined);
    });

    it('returns undefined if negated candidate condition is met', function() {
      var page = new pageflow.Page({
        template: 'video',
        configuration: {
          poster_id: 5,
          background_type: 'image'
        }
      });

      var thumbnailFile = page.thumbnailFile();

      expect(thumbnailFile).to.eq(undefined);
    });

    it('returns present file if candidate condition is met', function() {
      var page = new pageflow.Page({
        template: 'video',
        configuration: {
          image_id: 5,
          background_type: 'image'
        }
      });

      var thumbnailFile = page.thumbnailFile();

      expect(thumbnailFile.get('perma_id')).to.eq(5);
    });

    it('returns present file if negated candidate condition is not met', function() {
      var page = new pageflow.Page({
        template: 'video',
        configuration: {
          poster_id: 5,
          background_type: 'video'
        }
      });

      var thumbnailFile = page.thumbnailFile();

      expect(thumbnailFile.get('perma_id')).to.eq(5);
    });
  });
});