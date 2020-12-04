import {
  useEntryStructure,
  useChapters,
  useSection,
  useSectionContentElements,
  watchCollections
} from 'entryState';

import {ScrolledEntry} from 'editor/models/ScrolledEntry';

import {factories} from 'pageflow/testHelpers';
import {renderHookInEntry, normalizeSeed} from 'support';

const chaptersSeed = [
  {
    id: 1,
    permaId: 10,
    position: 1,
    configuration: {
      title: 'Chapter 1',
      summary: 'An introductory chapter'
    }
  },
  {
    id: 2,
    permaId: 11,
    position: 2,
    configuration: {
      title: 'Chapter 2',
      summary: 'A great chapter'
    }
  }
];
const sectionsSeed = [
  {
    id: 1,
    permaId: 101,
    chapterId: 1,
    position: 1,
    configuration: {
      transition: 'scroll'
    }
  },
  {
    id: 2,
    permaId: 102,
    chapterId: 2,
    position: 2,
    configuration: {
      transition: 'fade'
    }
  }
];
const contentElementsSeed = [
  {
    id: 1,
    permaId: 1001,
    sectionId: 1,
    typeName: 'heading',
    configuration: {
      children: 'Heading'
    }
  },
  {
    id: 2,
    permaId: 1002,
    sectionId: 1,
    typeName: 'textBlock',
    configuration: {
      children: 'Some text'
    }
  },
  {
    id: 3,
    permaId: 1003,
    sectionId: 2,
    typeName: 'image',
    configuration: {
      position: 'sticky',
      imageId: 4
    }
  },
  {
    id: 4,
    permaId: 1004,
    sectionId: 2,
    typeName: 'textBlock',
    configuration: {
      children: 'Some more text'
    }
  }
];

describe('useEntryStructure', () => {
  const expectedEntryStructure = [
    {
      title: 'Chapter 1',
      summary: 'An introductory chapter',
      sections: [
        {
          permaId: 101,
          previousSection: undefined,
          nextSection: {permaId: 102},
          sectionIndex: 0,

          transition: 'scroll'
        }
      ],
    },
    {
      title: 'Chapter 2',
      summary: 'A great chapter',
      sections: [
        {
          permaId: 102,
          previousSection: {permaId: 101},
          nextSection: undefined,
          sectionIndex: 1,

          transition: 'fade'
        }
      ]
    }
  ];

  it('reads data from watched collections', () => {
    const {result} = renderHookInEntry(() => useEntryStructure(), {
      setup: dispatch =>
        watchCollections(
          factories.entry(ScrolledEntry, {}, {
            entryTypeSeed: normalizeSeed({
              chapters: chaptersSeed,
              sections: sectionsSeed,
              contentElements: contentElementsSeed
            })
          }),
          {dispatch}
        )
    });
    const entryStructure = result.current;

    expect(entryStructure).toMatchObject(expectedEntryStructure);
  });

  it('reads data from seed', () => {
    const {result} = renderHookInEntry(
      () => useEntryStructure(),
      {
        seed: {
          chapters: chaptersSeed,
          sections: sectionsSeed,
          contentElements: contentElementsSeed
        }
      }
    );

    const entryStructure = result.current;

    expect(entryStructure).toMatchObject(expectedEntryStructure);
  });
});

describe('useSection', () => {
  const expectedSection = {
    transition: 'scroll'
  };

  it('returns data for one scene', () => {
    const {result} = renderHookInEntry(
      () => useSection({sectionPermaId: 101}),
      {
        seed: {
          chapters: chaptersSeed,
          sections: sectionsSeed,
          contentElements: contentElementsSeed
        }
      }
    );

    const section = result.current;

    expect(section).toMatchObject(expectedSection);
  });
});

describe('useChapters', () => {
  it('returns data for all chapters', () => {
    const {result} = renderHookInEntry(
      () => useChapters(),
      {
        seed: {
          chapters: chaptersSeed
        }
      }
    );

    const chapters = result.current;

    expect(chapters).toMatchObject([
      {
        permaId: 10,
        chapterRef: 'chapter-1',
        title: 'Chapter 1',
        summary: 'An introductory chapter'
      },
      {
        permaId: 11,
        chapterRef: 'chapter-2',
        title: 'Chapter 2',
        summary: 'A great chapter'
      }
    ]);
  });

  it('escapes chapter titles', () => {
    chaptersSeed[0].configuration.title = "<script>alert('test')</script>Titleä"
    const {result} = renderHookInEntry(
      () => useChapters(),
      {
        seed: {
          chapters: chaptersSeed
        }
      }
    );

    const chapters = result.current;

    expect(chapters).toMatchObject([
      {
        permaId: 10,
        chapterRef: "lessscriptgreateralert('test')lessscriptgreatertitlea",
        title: chaptersSeed[0].configuration.title,
        summary: 'An introductory chapter'
      },
      {
        permaId: 11,
        chapterRef: 'chapter-2',
        title: 'Chapter 2',
        summary: 'A great chapter'
      }
    ]);
  });
});

describe('useSectionContentElements', () => {
  const expectedContentElements = [
    {
      id: 3,
      permaId: 1003,
      type: 'image',
      position: 'sticky',
      props: {
        imageId: 4
      }
    },
    {
      id: 4,
      permaId: 1004,
      type: 'textBlock',
      props: {
        children: 'Some more text'
      }
    }
  ];

  it('returns list of content elements of section', () => {
    const {result} = renderHookInEntry(
      () => useSectionContentElements({sectionId: 2}),
      {
        seed: {
          chapters: chaptersSeed,
          sections: sectionsSeed,
          contentElements: contentElementsSeed
        }
      }
    );

    const contentElements = result.current;

    expect(contentElements).toMatchObject(expectedContentElements);
  });
});
