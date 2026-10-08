import {
  FragmentLibrariesCollection
} from 'editor/collections/FragmentLibrariesCollection';

describe('FragmentLibrariesCollection', () => {
  function library(attributes, {chapters, sections = [], contentElements = []}) {
    return {
      ...attributes,
      collections: {
        storylines: [{id: 1, permaId: 10, configuration: {main: true}}],
        chapters,
        sections,
        contentElements,
        imageFiles: [{permaId: 7}]
      }
    };
  }

  describe('#sharedFragments', () => {
    it('turns chapters of first library into fragments', () => {
      const libraries = new FragmentLibrariesCollection([
        library({id: 3, title: 'Shared'}, {
          chapters: [
            {id: 1, permaId: 100, configuration: {title: 'Intro'}},
            {id: 2, permaId: 200, configuration: {title: 'Outro'}}
          ]
        }),
        library({id: 4, title: 'Other'}, {
          chapters: [{id: 3, permaId: 300, configuration: {title: 'Other'}}]
        })
      ]);

      const fragments = libraries.sharedFragments();

      expect(fragments.pluck('title')).toEqual(['Intro', 'Outro']);
      expect(fragments.pluck('libraryId')).toEqual([3, 3]);
      expect(fragments.pluck('chapterPermaId')).toEqual([100, 200]);
    });

    it('is empty without libraries', () => {
      const libraries = new FragmentLibrariesCollection([]);

      expect(libraries.sharedFragments().length).toEqual(0);
    });

    it('collects sections of the fragments chapter', () => {
      const libraries = new FragmentLibrariesCollection([
        library({id: 3}, {
          chapters: [
            {id: 1, permaId: 100, configuration: {}},
            {id: 2, permaId: 200, configuration: {}}
          ],
          sections: [
            {id: 10, permaId: 1000, chapterId: 1},
            {id: 11, permaId: 1100, chapterId: 2},
            {id: 12, permaId: 1200, chapterId: 1}
          ]
        })
      ]);

      const fragment = libraries.sharedFragments().first();

      expect(fragment.get('sections').map(section => section.permaId)).toEqual([1000, 1200]);
      expect(fragment.firstSectionPermaId()).toEqual(1000);
    });
  });

  describe('fragment collections', () => {
    const libraries = () => new FragmentLibrariesCollection([
      library({id: 3}, {
        chapters: [
          {id: 1, permaId: 100, configuration: {}},
          {id: 2, permaId: 200, configuration: {}}
        ],
        sections: [
          {id: 10, permaId: 1000, chapterId: 1},
          {id: 11, permaId: 1100, chapterId: 2}
        ],
        contentElements: [
          {id: 20, permaId: 2000, sectionId: 10},
          {id: 21, permaId: 2100, sectionId: 11}
        ]
      })
    ]);

    it('contain only the chapter, its sections and their content elements', () => {
      const {collections} = libraries().sharedFragments().first().attributes;

      expect(collections.chapters.map(chapter => chapter.permaId)).toEqual([100]);
      expect(collections.sections.map(section => section.permaId)).toEqual([1000]);
      expect(collections.contentElements.map(element => element.permaId)).toEqual([2000]);
    });

    it('contain files and storylines of the library', () => {
      const {collections} = libraries().sharedFragments().first().attributes;

      expect(collections.imageFiles).toEqual([{permaId: 7}]);
      expect(collections.storylines).toHaveLength(1);
    });

    it('contain no widgets', () => {
      const {collections} = libraries().sharedFragments().first().attributes;

      expect(collections.widgets).toEqual([]);
    });

    it('override collections of the entry seed', () => {
      const fragment = libraries().sharedFragments().first();

      const seed = fragment.seed({
        config: {theme: {}},
        collections: {
          entries: [{permaId: 5}],
          imageFiles: [{permaId: 99}],
          sections: [{permaId: 8888}]
        }
      });

      expect(seed.config).toEqual({theme: {}});
      expect(seed.collections.entries).toEqual([{permaId: 5}]);
      expect(seed.collections.imageFiles).toEqual([{permaId: 7}]);
      expect(seed.collections.sections.map(section => section.permaId)).toEqual([1000]);
    });
  });
});
