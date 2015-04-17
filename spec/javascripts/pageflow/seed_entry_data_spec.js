describe('pageflow.SeedEntryData', function() {
  var p = pageflow;

  describe('#getChapterConfiguration', function() {
    it('returns configruation by chapter id', function() {
      var configuration = {};
      var entryData = new p.SeedEntryData({
        chapter_configurations: {
          1: configuration
        }
      });

      var result = entryData.getChapterConfiguration(1);

      expect(result).to.eq(configuration);
    });
  });

  describe('#getChapterPagePermaIds', function() {
    it('returns perma ids of pages of chapter by chapter id', function() {
      var entryData = new p.SeedEntryData({
        pages: [
          {perma_id: 100, chapter_id: 1},
          {perma_id: 101, chapter_id: 1},
          {perma_id: 102, chapter_id: 2}
        ]
      });

      var result = entryData.getChapterPagePermaIds(1);

      expect(result).to.deep.eq([100, 101]);
    });
  });

  describe('#getPageConfiguration', function() {
    it('returns configruation by page perma id', function() {
      var configuration = {};
      var entryData = new p.SeedEntryData({
        pages: [
          {perma_id: 100, configuration: configuration}
        ]
      });

      var result = entryData.getPageConfiguration(100);

      expect(result).to.eq(configuration);
    });
  });

  describe('#getChapterIdByPagePermaId', function() {
    it('returns id of pages parent chapter ', function() {
      var entryData = new p.SeedEntryData({
        pages: [
          {perma_id: 102, chapter_id: 2}
        ]
      });

      var result = entryData.getChapterIdByPagePermaId(102);

      expect(result).to.eq(2);
    });
  });
});