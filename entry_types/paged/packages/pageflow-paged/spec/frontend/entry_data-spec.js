import {SeedEntryData} from 'pageflow-paged/frontend';

describe('pageflow.EntryData', function() {

  function createEntryData(options) {
    return new SeedEntryData(options);
  }

  describe('#getParentPagePermaIdByPagePermaId', function() {
    it('returns perma id of page`s storyline`s parent page', function() {
      var entryData = new createEntryData({
        pages: [{
          perma_id: 5,
          chapter_id: 100
        }],
        chapters: [{
          id: 100,
          storyline_id: 1000
        }],
        storylines: [{
          id: 1000,
          configuration: {
            parent_page_perma_id: 6
          }
        }]
      });

      var result = entryData.getParentPagePermaIdByPagePermaId(5);

      expect(result).toBe(6);
    });
  });

  describe('#getStorylineIdByPagePermaId', function() {
    it('returns id of page`s storyline', function() {
      var entryData = new createEntryData({
        pages: [{
          perma_id: 5,
          chapter_id: 100
        }],
        chapters: [{
          id: 100,
          storyline_id: 1000
        }]
      });

      var result = entryData.getStorylineIdByPagePermaId(5);

      expect(result).toBe(1000);
    });
  });

  describe('#getParentStorylineId', function() {
    it('returns id of parent page`s storyline', function() {
      var entryData = new createEntryData({
        pages: [
          {
            perma_id: 5,
            chapter_id: 100
          }
        ],
        chapters: [
          {
            id: 100,
            storyline_id: 1000
          },
          {
            id: 101,
            storyline_id: 1001
          }
        ],
        storylines: [
          {
            id: 1000
          },
          {
            id: 1001,
            configuration: {
              parent_page_perma_id: 5
            }
          }
        ]
      });

      var result = entryData.getParentStorylineId(1001);

      expect(result).toBe(1000);
    });

    it('returns undefined if there is no parent page', function() {
      var entryData = new createEntryData({
        storylines: [{
          id: 1001
        }]
      });

      var result = entryData.getParentStorylineId(1001);

      expect(result).toBe(undefined);
    });
  });

  describe('#getParentChapterId', function() {
    it('returns id of chapter`s parent chapter', function() {
      var entryData = new createEntryData({
        chapters: [{
          id: 100,
          storyline_id: 1000
        }],
        storylines: [{
          id: 1000,
          configuration: {
            parent_page_perma_id: 6
          }
        }],
        pages: [{
          perma_id: 6,
          chapter_id: 101
        }]
      });

      var result = entryData.getParentChapterId(100);

      expect(result).toBe(101);
    });
  });

  describe('#getParentPagePermaId', function() {
    it('returns perma id of storyline`s parent page', function() {
      var entryData = new createEntryData({
        storylines: [{
          id: 1000,
          configuration: {
            parent_page_perma_id: 6
          }
        }]
      });

      var result = entryData.getParentPagePermaId(1000);

      expect(result).toBe(6);
    });
  });

  describe('#getStorylineLevel', function() {
    it('returns the number of parent storylines', function() {
      var entryData = new createEntryData({
        pages: [
          {
            perma_id: 5,
            chapter_id: 100
          },
          {
            perma_id: 6,
            chapter_id: 101
          }
        ],
        chapters: [
          {
            id: 100,
            storyline_id: 1000
          },
          {
            id: 101,
            storyline_id: 1001
          }
        ],
        storylines: [
          {
            id: 1000,
          },
          {
            id: 1001,
            configuration: {
              parent_page_perma_id: 5
            },
          },
          {
            id: 1002,
            configuration: {
              parent_page_perma_id: 6
            }
          }
        ]
      });

      expect(entryData.getStorylineLevel(1000)).toBe(0);
      expect(entryData.getStorylineLevel(1001)).toBe(1);
      expect(entryData.getStorylineLevel(1002)).toBe(2);
    });
  });
});