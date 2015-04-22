describe('pageflow.HighlightedPage', function() {
  var p = pageflow;

  describe('#getPagePermaId', function() {
    describe('for chapter with own navigation bar', function() {
      it('returns perma id of same page if page is displayed in navigation', function() {
        var outline = new p.HighlightedPage(new p.SeedEntryData({
          chapter_configurations: {
            1: {navigation_bar_mode: 'current_chapter'}
          },
          pages: [
            {perma_id: 100, chapter_id: 1}
          ]
        }));

        var result = outline.getPagePermaId(100);

        expect(result).to.eq(100);
      });

      it('returns perma id of previous page if page is not displayed in navigation', function() {
        var outline = new p.HighlightedPage(new p.SeedEntryData({
          chapter_configurations: {
            1: {navigation_bar_mode: 'current_chapter'}
          },
          getPageConfigurationByChapterId: {
            100: {display_in_navigation: false}
          },
          pages: [
            {perma_id: 100, chapter_id: 1}
          ]
        }));

        var result = outline.getPagePermaId(100);

        expect(result).to.eq(100);
      });
    });

    describe('for chapter with inherited navigation bar', function() {
      it('returns perma id of parent page', function() {
        var outline = new p.HighlightedPage(new p.SeedEntryData({
          chapter_configurations: {
            1: {
              navigation_bar_mode: 'inherit_from_parent',
              parent_page_perma_id: 101
            },
            2: {
              navigation_bar_mode: 'current_chapter'
            }
          },
          pages: [
            {perma_id: 100, chapter_id: 1},
            {perma_id: 101, chapter_id: 2}
          ]
        }));

        var result = outline.getPagePermaId(100);

        expect(result).to.eq(101);
      });
    });

    describe('for chapter with inherited navigation bar over multiple levels', function() {
      it('returns perma id of parent page', function() {
        var outline = new p.HighlightedPage(new p.SeedEntryData({
          chapter_configurations: {
            1: {
              navigation_bar_mode: 'inherit_from_parent',
              parent_page_perma_id: 101
            },
            2: {
              navigation_bar_mode: 'inherit_from_parent',
              parent_page_perma_id: 102
            }
          },
          pages: [
            {perma_id: 100, chapter_id: 1},
            {perma_id: 101, chapter_id: 2},
            {perma_id: 102, chapter_id: 3}
          ]
        }));

        var result = outline.getPagePermaId(100);

        expect(result).to.eq(102);
      });
    });
  });
});