describe('pageflow.ChapterFilter', function() {
  var p = pageflow;

  describe('#chapterVisibleFromChapter', function() {
    describe('with default strategy', function() {
      it('return true for chapters of same storyline', function() {
        var chapterFilter = new p.ChapterFilter(new p.SeedEntryData({
          storylines: [
            {
              id: 10,
              configuration: {}
            }
          ],
          chapters: [
            {
              id: 1,
              storyline_id: 10
            },
            {
              id: 2,
              storyline_id: 10
            },
            {
              id: 3,
              storyline_id: 11
            }
          ]
        }));

        expect(chapterFilter.chapterVisibleFromChapter(1, 1)).to.eq(true);
        expect(chapterFilter.chapterVisibleFromChapter(1, 2)).to.eq(true);
        expect(chapterFilter.chapterVisibleFromChapter(1, 3)).to.eq(false);
      });
    });

    describe('with inherit_from_parent strategy', function() {
      it('returns true only for chapters visible from parent chapter', function() {
        var chapterFilter = new p.ChapterFilter(new p.SeedEntryData({
          storylines: [
            {
              id: 10,
              configuration: {
                navigation_bar_mode: 'inherit_from_parent',
                parent_page_perma_id: 100
              }
            }
          ],
          chapters: [
            {
              id: 1,
              storyline_id: 10
            },
            {
              id: 2,
              storyline_id: 10
            },
            {
              id: 3,
              storyline_id: 11
            }
          ],
          pages: [
            {perma_id: 100, chapter_id: 3}
          ]
        }));

        expect(chapterFilter.chapterVisibleFromChapter(1, 1)).to.eq(false);
        expect(chapterFilter.chapterVisibleFromChapter(1, 2)).to.eq(false);
        expect(chapterFilter.chapterVisibleFromChapter(1, 3)).to.eq(true);
      });
    });

    describe('with non strategy', function() {
      it('returns false', function() {
        var chapterFilter = new p.ChapterFilter(new p.SeedEntryData({
          storylines: [
            {
              id: 10,
              configuration: {
                navigation_bar_mode: 'non'
              }
            }
          ],
          chapters: [
            {
              id: 1,
              storyline_id: 10
            },
            {
              id: 2,
              storyline_id: 10
            }
          ]
        }));

        expect(chapterFilter.chapterVisibleFromChapter(1, 1)).to.eq(false);
        expect(chapterFilter.chapterVisibleFromChapter(1, 2)).to.eq(false);
      });
    });
  });
});