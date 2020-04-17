import {SeedEntryData} from 'pageflow-paged/frontend';

describe('pageflow.SeedEntryData', function() {

  describe('#getThemingOption', function() {
    it('returns option value by name', function() {
      var entryData = new SeedEntryData({
        theme: {
          page_change_by_scrolling: true
        }
      });

      var result = entryData.getThemingOption('page_change_by_scrolling');

      expect(result).toBe(true);
    });
  });

  describe('#getFile', function() {
    it('returns file attributes by collection name and file perma id', function() {
      var entryData = new SeedEntryData({
        files: {
          image_files: [
            {
              perma_id: 1,
              url: 'image.png'
            }
          ]
        }
      });

      var result = entryData.getFile('image_files', 1);

      expect(result.url).toBe('image.png');
    });
  });

  describe('#getStorylineConfiguration', function() {
    it('returns configruation by chapter id', function() {
      var configuration = {};
      var entryData = new SeedEntryData({
        storylines: [
          {
            id: 1,
            configuration: configuration
          }
        ]
      });

      var result = entryData.getStorylineConfiguration(1);

      expect(result).toBe(configuration);
    });
  });

  describe('#getChapterConfiguration', function() {
    it('returns configruation by chapter id', function() {
      var configuration = {};
      var entryData = new SeedEntryData({
        chapters: [{
          id: 1,
          configuration: configuration
        }]
      });

      var result = entryData.getChapterConfiguration(1);

      expect(result).toBe(configuration);
    });
  });

  describe('#getChapterPagePermaIds', function() {
    it('returns perma ids of pages of chapter by chapter id', function() {
      var entryData = new SeedEntryData({
        pages: [
          {perma_id: 100, chapter_id: 1},
          {perma_id: 101, chapter_id: 1},
          {perma_id: 102, chapter_id: 2}
        ]
      });

      var result = entryData.getChapterPagePermaIds(1);

      expect(result).toEqual([100, 101]);
    });
  });

  describe('#getPageConfiguration', function() {
    it('returns configruation by page perma id', function() {
      var configuration = {};
      var entryData = new SeedEntryData({
        pages: [
          {perma_id: 100, configuration: configuration}
        ]
      });

      var result = entryData.getPageConfiguration(100);

      expect(result).toBe(configuration);
    });
  });

  describe('#getPagePosition', function() {
    it('returns index of page in pages list', function() {
      var entryData = new SeedEntryData({
        pages: [
          {perma_id: 100},
          {perma_id: 101}
        ]
      });

      expect(entryData.getPagePosition(100)).toBe(0);
      expect(entryData.getPagePosition(101)).toBe(1);
    });
  });

  describe('#getChapterIdByPagePermaId', function() {
    it('returns id of page`s parent chapter ', function() {
      var entryData = new SeedEntryData({
        pages: [
          {perma_id: 102, chapter_id: 2}
        ]
      });

      var result = entryData.getChapterIdByPagePermaId(102);

      expect(result).toBe(2);
    });
  });

  describe('#getStorylineIdByChapterId', function() {
    it('returns id of chapter`s parent storyline', function() {
      var entryData = new SeedEntryData({
        chapters: [
          {id: 102, storyline_id: 2}
        ]
      });

      var result = entryData.getStorylineIdByChapterId(102);

      expect(result).toBe(2);
    });
  });
});
