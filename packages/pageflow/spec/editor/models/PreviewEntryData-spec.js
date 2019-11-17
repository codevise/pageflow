describe('pageflow.PreviewEntryData', () => {
  var p = pageflow;

  describe('#getThemingOption', () => {
    test('returns option value by name', () => {
      var entry = support.factories.entry(
        {
          configuration: {theme_name: 'custom'}
        },
        {
          themes: new p.ThemesCollection([
            {
              name: 'custom',
              page_change_by_scrolling: true
            }
          ])
        }
      );
      var entryData = new p.PreviewEntryData({
        entry: entry
      });

      var result = entryData.getThemingOption('page_change_by_scrolling');

      expect(result).toBe(true);
    });
  });

  describe('#getFile', () => {
    test(
      'returns file attributes by collection name and file perma_id',
      () => {
        var entry = support.factories.entry({}, {
          fileTypes: support.factories.fileTypesWithImageFileType(),
          files: {
            image_files: pageflow.FilesCollection.createForFileType(
              support.factories.imageFileType(),
              [
                {
                  id: 1,
                  perma_id: 1,
                  url: 'image.png'
                }
              ]
            )
          }
        });
        var entryData = new p.PreviewEntryData({
          entry: entry
        });

        var result = entryData.getFile('image_files', 1);

        expect(result.url).toBe('image.png');
      }
    );
  });

  describe('#getStorylineConfiguration', () => {
    test('returns configuration by storyline id', () => {
      var configuration = {title: 'some text'};
      var storyline = new p.Storyline({id: 1, configuration: configuration}, {
        chapters: new p.ChaptersCollection([])
      });
      var entryData = new p.PreviewEntryData({
        storylines: new p.StorylinesCollection([storyline])
      });

      var result = entryData.getStorylineConfiguration(1);

      expect(result.title).toBe('some text');
    });
  });

  describe('#getChapterConfiguration', () => {
    test('returns configuration by chapter id', () => {
      var configuration = {title: 'some text'};
      var chapter = new p.Chapter({id: 1, configuration: configuration}, {
        pages: new p.PagesCollection([])
      });
      var entryData = new p.PreviewEntryData({
        chapters: new p.ChaptersCollection([chapter])
      });

      var result = entryData.getChapterConfiguration(1);

      expect(result.title).toBe('some text');
    });
  });

  describe('#getChapterPagePermaIds', () => {
    test('returns perma ids of pages of chapter by chapter id', () => {
      var chapter = new p.Chapter({id: 1}, {
        pages: new p.PagesCollection([
          {id: 1, chapter_id: 1, perma_id: 100},
          {id: 2, chapter_id: 1, perma_id: 101}
        ])
      });
      var entryData = new p.PreviewEntryData({
        chapters: new p.ChaptersCollection([chapter])
      });

      var result = entryData.getChapterPagePermaIds(1);

      expect(result).toEqual([100, 101]);
    });
  });

  describe('#getPageConfiguration', () => {
    test('returns configruation by page perma id', () => {
      var configuration = {title: 'some text'};
      var page = new p.Page({perma_id: 100, configuration: configuration});
      var entryData = new p.PreviewEntryData({
        pages: new p.PagesCollection([page])
      });

      var result = entryData.getPageConfiguration(100);

      expect(result.title).toBe('some text');
    });
  });

  describe('#getPagePosition', () => {
    test('returns configruation by page perma id', () => {
      var page1 = new p.Page({perma_id: 100});
      var page2 = new p.Page({perma_id: 101});
      var entryData = new p.PreviewEntryData({
        pages: new p.PagesCollection([page1, page2])
      });

      expect(entryData.getPagePosition(100)).toBe(0);
      expect(entryData.getPagePosition(101)).toBe(1);
    });
  });

  describe('#getChapterIdByPagePermaId', () => {
    test('returns id of pages parent chapter ', () => {
      var page = new p.Page({perma_id: 102, chapter_id: 2});
      var entryData = new p.PreviewEntryData({
        pages: new p.PagesCollection([page])
      });

      var result = entryData.getChapterIdByPagePermaId(102);

      expect(result).toBe(2);
    });
  });

  describe('#getStorylineIdByChapterId', () => {
    test('returns id of chapter`s parent storyline', () => {
      var chapter = new p.Chapter({id: 102, storyline_id: 2}, {
        pages: new p.PagesCollection([])
      });
      var entryData = new p.PreviewEntryData({
        chapters: new p.ChaptersCollection([chapter])
      });

      var result = entryData.getStorylineIdByChapterId(102);

      expect(result).toBe(2);
    });
  });
});
