import {ChaptersCollection, PagesCollection, StorylineTransitiveChildPages, StorylinesCollection} from 'pageflow/editor';

describe('pageflow.StorylineTransitiveChildPages', () => {
  describe('#contain', () => {
    it('returns true for page of storyline', () => {
      var pages = new PagesCollection([
        {perma_id: 1, chapter_id: 10}
      ]);
      var chapters = new ChaptersCollection([
        {id: 10, storyline_id: 100}
      ], {pages: pages});
      var storylines = new StorylinesCollection([
        {id: 100, title: 'parent'}
      ], {chapters: chapters});
      var storyline = storylines.get(100);
      var childPages = new StorylineTransitiveChildPages(storyline, storylines, pages);

      expect(childPages.contain(pages.getByPermaId(1))).toBe(true);
    });

    it('returns false for page of unrelated storyline', () => {
      var pages = new PagesCollection([
        {perma_id: 1, chapter_id: 10}
      ]);
      var chapters = new ChaptersCollection([
        {id: 10, storyline_id: 110}
      ], {pages: pages});
      var storylines = new StorylinesCollection([
        {id: 100, title: 'parent'},
        {id: 110, title: 'other'}
      ], {chapters: chapters});
      var storyline = storylines.get(100);
      var childPages = new StorylineTransitiveChildPages(storyline, storylines, pages);

      expect(childPages.contain(pages.getByPermaId(1))).toBe(false);
    });

    it('returns true for page of direct child storyline', () => {
      var pages = new PagesCollection([
        {perma_id: 1, chapter_id: 10},
        {perma_id: 2, chapter_id: 20},
      ]);
      var chapters = new ChaptersCollection([
        {id: 10, storyline_id: 100},
        {id: 20, storyline_id: 200}
      ], {pages: pages});
      var storylines = new StorylinesCollection([
        {id: 100, title: 'parent'},
        {id: 200, title: 'child', configuration: {parent_page_perma_id: 1}}
      ], {chapters: chapters});
      var storyline = storylines.get(100);
      var childPages = new StorylineTransitiveChildPages(storyline, storylines, pages);

      expect(childPages.contain(pages.getByPermaId(2))).toBe(true);
    });

    it('returns true for page of indirect child storyline', () => {
      var pages = new PagesCollection([
        {perma_id: 1, chapter_id: 10},
        {perma_id: 2, chapter_id: 20},
        {perma_id: 3, chapter_id: 30}
      ]);
      var chapters = new ChaptersCollection([
        {id: 10, storyline_id: 100},
        {id: 20, storyline_id: 200},
        {id: 30, storyline_id: 300}
      ], {pages: pages});
      var storylines = new StorylinesCollection([
        {id: 100, title: 'parent'},
        {id: 200, title: 'child', configuration: {parent_page_perma_id: 1}},
        {id: 300, title: 'grandson', configuration: {parent_page_perma_id: 2}}
      ], {chapters: chapters});
      var storyline = storylines.get(100);
      var childPages = new StorylineTransitiveChildPages(storyline, storylines, pages);

      expect(childPages.contain(pages.getByPermaId(3))).toBe(true);
    });

    it('returns false for page of parent storyline', () => {
      var pages = new PagesCollection([
        {perma_id: 1, chapter_id: 10},
        {perma_id: 2, chapter_id: 20},
      ]);
      var chapters = new ChaptersCollection([
        {id: 10, storyline_id: 100},
        {id: 20, storyline_id: 200}
      ], {pages: pages});
      var storylines = new StorylinesCollection([
        {id: 100, title: 'parent'},
        {id: 200, title: 'child', confiuration: {parent_page_perma_id: 1}}
      ], {chapters: chapters});
      var storyline = storylines.get(200);
      var childPages = new StorylineTransitiveChildPages(storyline, storylines, pages);

      expect(childPages.contain(pages.getByPermaId(1))).toBe(false);
    });
  });
});
