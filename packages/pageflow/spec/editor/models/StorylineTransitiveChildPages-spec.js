describe('pageflow.StorylineTransitiveChildPages', function() {
  var p = pageflow;

  describe('#contain', function() {
    it('returns true for page of storyline', function() {
      var pages = new p.PagesCollection([
        {perma_id: 1, chapter_id: 10}
      ]);
      var chapters = new p.ChaptersCollection([
        {id: 10, storyline_id: 100}
      ], {pages: pages});
      var storylines = new p.StorylinesCollection([
        {id: 100, title: 'parent'}
      ], {chapters: chapters});
      var storyline = storylines.get(100);
      var childPages = new p.StorylineTransitiveChildPages(storyline, storylines, pages);

      expect(childPages.contain(pages.getByPermaId(1))).to.eq(true);
    });

    it('returns false for page of unrelated storyline', function() {
      var pages = new p.PagesCollection([
        {perma_id: 1, chapter_id: 10}
      ]);
      var chapters = new p.ChaptersCollection([
        {id: 10, storyline_id: 110}
      ], {pages: pages});
      var storylines = new p.StorylinesCollection([
        {id: 100, title: 'parent'},
        {id: 110, title: 'other'}
      ], {chapters: chapters});
      var storyline = storylines.get(100);
      var childPages = new p.StorylineTransitiveChildPages(storyline, storylines, pages);

      expect(childPages.contain(pages.getByPermaId(1))).to.eq(false);
    });

    it('returns true for page of direct child storyline', function() {
      var pages = new p.PagesCollection([
        {perma_id: 1, chapter_id: 10},
        {perma_id: 2, chapter_id: 20},
      ]);
      var chapters = new p.ChaptersCollection([
        {id: 10, storyline_id: 100},
        {id: 20, storyline_id: 200}
      ], {pages: pages});
      var storylines = new p.StorylinesCollection([
        {id: 100, title: 'parent'},
        {id: 200, title: 'child', configuration: {parent_page_perma_id: 1}}
      ], {chapters: chapters});
      var storyline = storylines.get(100);
      var childPages = new p.StorylineTransitiveChildPages(storyline, storylines, pages);

      expect(childPages.contain(pages.getByPermaId(2))).to.eq(true);
    });

    it('returns true for page of indirect child storyline', function() {
      var pages = new p.PagesCollection([
        {perma_id: 1, chapter_id: 10},
        {perma_id: 2, chapter_id: 20},
        {perma_id: 3, chapter_id: 30}
      ]);
      var chapters = new p.ChaptersCollection([
        {id: 10, storyline_id: 100},
        {id: 20, storyline_id: 200},
        {id: 30, storyline_id: 300}
      ], {pages: pages});
      var storylines = new p.StorylinesCollection([
        {id: 100, title: 'parent'},
        {id: 200, title: 'child', configuration: {parent_page_perma_id: 1}},
        {id: 300, title: 'grandson', configuration: {parent_page_perma_id: 2}}
      ], {chapters: chapters});
      var storyline = storylines.get(100);
      var childPages = new p.StorylineTransitiveChildPages(storyline, storylines, pages);

      expect(childPages.contain(pages.getByPermaId(3))).to.eq(true);
    });

    it('returns false for page of parent storyline', function() {
      var pages = new p.PagesCollection([
        {perma_id: 1, chapter_id: 10},
        {perma_id: 2, chapter_id: 20},
      ]);
      var chapters = new p.ChaptersCollection([
        {id: 10, storyline_id: 100},
        {id: 20, storyline_id: 200}
      ], {pages: pages});
      var storylines = new p.StorylinesCollection([
        {id: 100, title: 'parent'},
        {id: 200, title: 'child', confiuration: {parent_page_perma_id: 1}}
      ], {chapters: chapters});
      var storyline = storylines.get(200);
      var childPages = new p.StorylineTransitiveChildPages(storyline, storylines, pages);

      expect(childPages.contain(pages.getByPermaId(1))).to.eq(false);
    });
  });
});