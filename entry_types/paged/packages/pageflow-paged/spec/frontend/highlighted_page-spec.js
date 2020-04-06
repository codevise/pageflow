import 'pageflow/frontend';
import {HighlightedPage, SeedEntryData} from 'pageflow-paged/frontend';

describe('pageflow.HighlightedPage', function() {
  describe('#getPagePermaId', function() {
    describe('for storylines with own navigation bar', function() {
      it('returns perma id of same page if page is displayed in navigation', function() {
        var outline = new HighlightedPage(new SeedEntryData({
          storylines: [
            {
              id: 10,
              configuration: {}
            }
          ],
          chapters: [{
            id: 1,
            storyline_id: 10
          }],
          pages: [
            {
              perma_id: 100,
              chapter_id: 1
            }
          ]
        }));

        var result = outline.getPagePermaId(100);

        expect(result).toBe(100);
      });

      it('returns perma id of previous page if page is not displayed in navigation', function() {
        var outline = new HighlightedPage(new SeedEntryData({
          storylines: [
            {
              id: 10,
              configuration: {}
            }
          ],
          chapters: [{
            id: 1,
            storyline_id: 10
          }],
          pages: [
            {
              perma_id: 100,
              chapter_id: 1
            },
            {
              perma_id: 101,
              chapter_id: 1,
              configuration: {
                display_in_navigation: false
              }
            }
          ]
        }));

        var result = outline.getPagePermaId(101);

        expect(result).toBe(100);
      });
    });

    describe('for chapter with inherited navigation bar', function() {
      it('returns perma id of parent page', function() {
        var outline = new HighlightedPage(new SeedEntryData({
          storylines: [
            {
              id: 10,
              configuration: {
                navigation_bar_mode: 'inherit_from_parent',
                parent_page_perma_id: 101
              }
            },
          ],
          chapters: [
            {
              id: 1,
              storyline_id: 10
            }
          ],
          pages: [
            {
              perma_id: 100,
              chapter_id: 1
            },
            {
              perma_id: 101,
              chapter_id: 2
            }
          ]
        }));

        var result = outline.getPagePermaId(100);

        expect(result).toBe(101);
      });
    });

    describe('for chapter with inherited navigation bar over multiple levels', function() {
      it('returns perma id of parent page', function() {
        var outline = new HighlightedPage(new SeedEntryData({
          storylines: [
            {
              id: 10,
              configuration: {
                navigation_bar_mode: 'inherit_from_parent',
                parent_page_perma_id: 101
              }
            },
            {
              id: 20,
              configuration: {
                navigation_bar_mode: 'inherit_from_parent',
                parent_page_perma_id: 102
              }
            }
          ],
          chapters: [
            {id: 1, storyline_id: 10},
            {id: 2, storyline_id: 20},
            {id: 3, storyline_id: 30}
          ],
          pages: [
            {perma_id: 100, chapter_id: 1},
            {perma_id: 101, chapter_id: 2},
            {perma_id: 102, chapter_id: 3}
          ]
        }));

        var result = outline.getPagePermaId(100);

        expect(result).toBe(102);
      });
    });

    describe('with customNavigationBarMode option', function() {
      it('uses navigation bar modes returned by option', function() {
        var entryData = new SeedEntryData({
          storylines: [
            {
              id: 10,
              configuration: {
                parent_page_perma_id: 101
              }
            },
            {
              id: 20,
              configuration: {
                parent_page_perma_id: 102,
              }
            },
            {
              id: 30,
              configuration: {
                main: true
              }
            }
          ],
          chapters: [
            {id: 1, storyline_id: 10},
            {id: 2, storyline_id: 20},
            {id: 3, storyline_id: 30}
          ],
          pages: [
            {perma_id: 100, chapter_id: 1},
            {perma_id: 101, chapter_id: 2},
            {perma_id: 102, chapter_id: 3}
          ]
        });
        var outline = new HighlightedPage(entryData, {
          customNavigationBarMode: function(storylineId, entryData) {
            if (!entryData.getStorylineConfiguration(storylineId).main) {
              return 'inherit_from_parent';
            }
          }
        });

        var result = outline.getPagePermaId(100);

        expect(result).toBe(102);
      });
    });
  });
});