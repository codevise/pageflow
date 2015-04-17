describe('pageflow.PreviewEntryData', function() {
  var p = pageflow;

  describe('#getChapterConfiguration', function() {
    it('returns configuration by chapter id', function() {
      var configuration = {title: 'some text'};
      var chapter = new p.Chapter({id: 1, configuration: configuration}, {
        pages: new p.PagesCollection([])
      });
      var entryData = new p.PreviewEntryData({
        chapters: new p.ChaptersCollection([chapter])
      });

      var result = entryData.getChapterConfiguration(1);

      expect(result.title).to.eq('some text');
    });
  });

  describe('#getChapterPagePermaIds', function() {
    it('returns perma ids of pages of chapter by chapter id', function() {
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

      expect(result).to.deep.eq([100, 101]);
    });
  });

  describe('#getPageConfiguration', function() {
    it('returns configruation by page perma id', function() {
      var configuration = {title: 'some text'};
      var page = new p.Page({perma_id: 100, configuration: configuration});
      var entryData = new p.PreviewEntryData({
        pages: new p.PagesCollection([page])
      });

      var result = entryData.getPageConfiguration(100);

      expect(result.title).to.eq('some text');
    });
  });

  describe('#getChapterIdByPagePermaId', function() {
    it('returns id of pages parent chapter ', function() {
      var page = new p.Page({perma_id: 102, chapter_id: 2});
      var entryData = new p.PreviewEntryData({
        pages: new p.PagesCollection([page])
      });

      var result = entryData.getChapterIdByPagePermaId(102);

      expect(result).to.eq(2);
    });
  });
});