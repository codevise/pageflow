describe('pageflow.ChapterFilter', function() {
  var p = pageflow;

  describe('#chapterVisibleFromChapter', function() {
    describe('with all_chapters strategy', function() {
      it('returns false', function() {
        var currentChapterConfiguration = {
          navigation_bar_mode: 'all_chapters'
        };
        var chapterFilter = new p.ChapterFilter(new p.SeedEntryData({
          chapter_configurations: {
            1: currentChapterConfiguration
          }
        }));

        expect(chapterFilter.chapterVisibleFromChapter(1, 1)).to.eq(true);
        expect(chapterFilter.chapterVisibleFromChapter(1, 2)).to.eq(true);
      });
    });

    describe('with current_chapter strategy', function() {
      it('returns true only for current chapter', function() {
        var currentChapterConfiguration = {navigation_bar_mode: 'current_chapter'};
        var chapterFilter = new p.ChapterFilter(new p.SeedEntryData({
          chapter_configurations: {
            1: currentChapterConfiguration
          }
        }));

        expect(chapterFilter.chapterVisibleFromChapter(1, 1)).to.eq(true);
        expect(chapterFilter.chapterVisibleFromChapter(1, 2)).to.eq(false);
      });
    });

    describe('with inherit_from_parent strategy', function() {
      it('returns true only for chapters visible from parent chapter', function() {
        var currentChapterConfiguration = {
          navigation_bar_mode: 'inherit_from_parent',
          parent_page_perma_id: 100
        };
        var parentChapterConfiguration = {navigation_bar_mode: 'current_chapter'};
        var chapterFilter = new p.ChapterFilter(new p.SeedEntryData({
          chapter_configurations: {
            1: currentChapterConfiguration,
            2: parentChapterConfiguration
          },
          pages: [
            {perma_id: 100, chapter_id: 2}
          ]
        }));

        expect(chapterFilter.chapterVisibleFromChapter(1, 1)).to.eq(false);
        expect(chapterFilter.chapterVisibleFromChapter(1, 2)).to.eq(true);
      });
    });

    describe('with non strategy', function() {
      it('returns false', function() {
        var currentChapterConfiguration = {
          navigation_bar_mode: 'non'
        };
        var chapterFilter = new p.ChapterFilter(new p.SeedEntryData({
          chapter_configurations: {
            1: currentChapterConfiguration
          }
        }));

        expect(chapterFilter.chapterVisibleFromChapter(1, 1)).to.eq(false);
        expect(chapterFilter.chapterVisibleFromChapter(1, 2)).to.eq(false);
      });
    });

    describe('with same_parent_page strategy', function() {
      it('returns true only for chapters with same parent page', function() {
        var currentChapterConfiguration = {
          navigation_bar_mode: 'same_parent_page',
          parent_page_perma_id: 100
        };
        var sameParentChapterConfiguration = {
          parent_page_perma_id: 100
        };
        var otherParentChapterConfiguration = {
          parent_page_perma_id: 102
        };
        var chapterFilter = new p.ChapterFilter(new p.SeedEntryData({
          chapter_configurations: {
            1: currentChapterConfiguration,
            2: sameParentChapterConfiguration,
            3: otherParentChapterConfiguration
          }
        }));

        expect(chapterFilter.chapterVisibleFromChapter(1, 1)).to.eq(true);
        expect(chapterFilter.chapterVisibleFromChapter(1, 2)).to.eq(true);
        expect(chapterFilter.chapterVisibleFromChapter(1, 3)).to.eq(false);
      });
    });

    describe('with same_parent_chapter strategy', function() {
      it('returns true only for chapters with same parent chapter', function() {
        var currentChapterConfiguration = {
          navigation_bar_mode: 'same_parent_chapter',
          parent_page_perma_id: 100
        };
        var sameParentChapterConfiguration = {
          parent_page_perma_id: 101
        };
        var otherParentChapterConfiguration = {
          parent_page_perma_id: 102
        };
        var chapterFilter = new p.ChapterFilter(new p.SeedEntryData({
          chapter_configurations: {
            1: currentChapterConfiguration,
            2: sameParentChapterConfiguration,
            3: otherParentChapterConfiguration
          },
          pages: [
            {perma_id: 100, chapter_id: 0},
            {perma_id: 101, chapter_id: 0},
            {perma_id: 102, chapter_id: 5}
          ]
        }));

        expect(chapterFilter.chapterVisibleFromChapter(1, 1)).to.eq(true);
        expect(chapterFilter.chapterVisibleFromChapter(1, 2)).to.eq(true);
        expect(chapterFilter.chapterVisibleFromChapter(1, 3)).to.eq(false);
      });
    });
  });
});