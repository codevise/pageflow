import {ChaptersCollection, PagesCollection, StorylineOrdering, StorylinesCollection} from '$pageflow/editor';

describe('pageflow.StorylineOrdering', () => {
  describe('#sort', () => {
    test(
      'sets positions based on depth first search along chapter hierachy',
      () => {
        var pages = new PagesCollection([
          {perma_id: 1, chapter_id: 10},
          {perma_id: 2, chapter_id: 20}
        ]);
        var chapters = new ChaptersCollection([
          {id: 10, storyline_id: 100},
          {id: 20, storyline_id: 200}
        ], {pages: pages});
        var storylines = new StorylinesCollection([
          {id: 100, title: '1', configuration: {main: true}},
          {id: 200, title: '1.1', configuration: {parent_page_perma_id: 1}},
          {id: 300, title: '1.1.1', configuration: {parent_page_perma_id: 2}}
        ].reverse(), {chapters: chapters});

        new StorylineOrdering(storylines, pages).sort();

        expect(storylines.pluck('title')).toEqual(['1', '1.1', '1.1.1']);
        expect(storylines.pluck('level')).toEqual([0, 1, 2]);
      }
    );

    test(
      'orders children of the main storyline before other storylines without parent',
      () => {
        var pages = new PagesCollection([]);
        var chapters = new ChaptersCollection([], {pages: pages});
        var storylines = new StorylinesCollection([
          {id: 100, title: '1', configuration: {main: true}},
          {id: 200, title: 'no parent A'},
          {id: 300, title: 'no parent B'}
        ].reverse(), {chapters: chapters});

        new StorylineOrdering(storylines, pages).sort();

        expect(storylines.pluck('title')).toEqual(['1', 'no parent B', 'no parent A']);
        expect(storylines.pluck('level')).toEqual([0, 0, 0]);
      }
    );

    test(
      'orders storylines with same parent storyline by parent page order',
      () => {
        var pages = new PagesCollection([
          {perma_id: 1, chapter_id: 10, position: 0},
          {perma_id: 2, chapter_id: 10, position: 1},
          {perma_id: 3, chapter_id: 10, position: 2}
        ]);
        var chapters = new ChaptersCollection([
          {id: 10, storyline_id: 100}
        ], {pages: pages});
        var storylines = new StorylinesCollection([
          {id: 100, title: '1', configuration: {main: true}},
          {id: 200, title: '1.1', configuration: {parent_page_perma_id: 1}},
          {id: 300, title: '1.2', configuration: {parent_page_perma_id: 2}},
          {id: 400, title: '1.3', configuration: {parent_page_perma_id: 3}}
        ].reverse(), {chapters: chapters});

        new StorylineOrdering(storylines, pages).sort();

        expect(storylines.pluck('title')).toEqual(['1', '1.1', '1.2', '1.3']);
        expect(storylines.pluck('level')).toEqual([0, 1, 1, 1]);
      }
    );

    test('orders storylines with same parent page by row and lane', () => {
      var pages = new PagesCollection([
        {perma_id: 1, chapter_id: 10}
      ]);
      var chapters = new ChaptersCollection([
        {id: 10, storyline_id: 100}
      ], {pages: pages});
      var storylines = new StorylinesCollection([
        {id: 100, title: '1', configuration: {main: true}},
        {id: 200, title: '1.1', configuration: {parent_page_perma_id: 1, row: 4, lane: 2}},
        {id: 300, title: '1.2', configuration: {parent_page_perma_id: 1, row: 6, lane: 2}},
        {id: 400, title: '1.3', configuration: {parent_page_perma_id: 1, row: 1, lane: 3}}
      ].reverse(), {chapters: chapters});

      new StorylineOrdering(storylines, pages).sort();

      expect(storylines.pluck('title')).toEqual(['1', '1.1', '1.2', '1.3']);
      expect(storylines.pluck('level')).toEqual([0, 1, 1, 1]);
    });

    test('orders storylines with same row and lane by title', () => {
      var pages = new PagesCollection([
        {perma_id: 1, chapter_id: 10}
      ]);
      var chapters = new ChaptersCollection([
        {id: 10, storyline_id: 100}
      ], {pages: pages});
      var storylines = new StorylinesCollection([
        {id: 100, title: '1', configuration: {main: true}},
        {id: 200, title: '1.1', configuration: {title: '1.1', parent_page_perma_id: 1, row: 1, lane: 1}},
        {id: 300, title: '1.2', configuration: {title: '1.2', parent_page_perma_id: 1, row: 1, lane: 1}},
        {id: 400, title: '1.3', configuration: {title: '1.3', parent_page_perma_id: 1, row: 1, lane: 1}}
      ].reverse(), {chapters: chapters});

      new StorylineOrdering(storylines, pages).sort();

      expect(storylines.pluck('title')).toEqual(['1', '1.1', '1.2', '1.3']);
      expect(storylines.pluck('level')).toEqual([0, 1, 1, 1]);
    });
  });
});
