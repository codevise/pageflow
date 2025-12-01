import {
  useEntryStructure,
  useSectionsWithChapter,
  useChapter,
  useChapters,
  useMainChapters,
  useSection,
  useSectionForegroundContentElements,
  useContentElement,
  watchCollections
} from 'entryState';

import {ScrolledEntry} from 'editor/models/ScrolledEntry';

import {factories} from 'pageflow/testHelpers';
import {renderHookInEntry, normalizeSeed} from 'support';


const storylinesSeed = [
  {
    id: 1,
    permaId: 10,
    position: 1,
    configuration: {
      main: true
    }
  },
  {
    id: 2,
    permaId: 11,
    position: 2,
    configuration: {}
  }
];
const chaptersSeed = [
  {
    id: 1,
    permaId: 10,
    storylineId: 1,
    position: 1,
    configuration: {
      title: 'Chapter 1',
      summary: 'An introductory chapter'
    }
  },
  {
    id: 2,
    permaId: 11,
    storylineId: 1,
    position: 2,
    configuration: {
      title: 'Chapter 2',
      summary: 'A great chapter',
      hideInNavigation: true
    }
  },
  {
    id: 3,
    permaId: 12,
    storylineId: 2,
    position: 1,
    configuration: {
      title: 'Some excursion'
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
  },
  {
    id: 3,
    permaId: 103,
    chapterId: 3,
    position: 1,
    configuration: {
      transition: 'scroll'
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
      width: 1,
      imageId: 4
    }
  },
  {
    id: 4,
    permaId: 1004,
    sectionId: 2,
    typeName: 'image',
    configuration: {
      position: 'side',
      imageId: 4
    }
  },
  {
    id: 5,
    permaId: 1005,
    sectionId: 2,
    typeName: 'textBlock',
    configuration: {
      children: 'Some more text'
    }
  }
];

describe('useEntryStructure', () => {
  it('sets isExcursion to false for chapters in main storyline', () => {
    const {result} = renderHookInEntry(
      () => useEntryStructure(),
      {
        seed: {
          storylines: storylinesSeed,
          chapters: chaptersSeed,
          sections: sectionsSeed
        }
      }
    );

    expect(result.current.main[0].isExcursion).toBe(false);
    expect(result.current.main[1].isExcursion).toBe(false);
  });

  it('sets isExcursion to true for chapters not in main storyline', () => {
    const {result} = renderHookInEntry(
      () => useEntryStructure(),
      {
        seed: {
          storylines: storylinesSeed,
          chapters: chaptersSeed,
          sections: sectionsSeed
        }
      }
    );

    expect(result.current.excursions[0].isExcursion).toBe(true);
  });

  const expectedEntryStructure = {
    main: [
      {
        permaId: 10,
        title: 'Chapter 1',
        chapterSlug: 'chapter-1',
        summary: 'An introductory chapter',
        sections: [
          {
            permaId: 101,
            chapter: {permaId: 10},
            previousSection: undefined,
            nextSection: {permaId: 102},
            sectionIndex: 0,

            transition: 'scroll'
          }
        ],
      },
      {
        permaId: 11,
        title: 'Chapter 2',
        chapterSlug: 'chapter-2',
        summary: 'A great chapter',
        sections: [
          {
            permaId: 102,
            chapter: {permaId: 11},
            previousSection: {permaId: 101},
            nextSection: undefined,
            sectionIndex: 1,

            transition: 'fade'
          }
        ]
      }
    ],
    excursions: [
      {
        permaId: 12,
        title: 'Some excursion',
        chapterSlug: 'some-excursion',
        sections: [
          {
            permaId: 103,
            chapter: {permaId: 12},
            previousSection: undefined,
            nextSection: undefined,
            sectionIndex: 0,

            transition: 'scroll'
          }
        ]
      }
    ]
  };

  it('reads data from watched collections', () => {
    const {result} = renderHookInEntry(() => useEntryStructure(), {
      setup: dispatch =>
        watchCollections(
          factories.entry(ScrolledEntry, {}, {
            entryTypeSeed: normalizeSeed({
              storylines: storylinesSeed,
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
    expect(entryStructure.mainSectionsCount).toBe(2);
  });

  it('reads data from seed', () => {
    const {result} = renderHookInEntry(
      () => useEntryStructure(),
      {
        seed: {
          storylines: storylinesSeed,
          chapters: chaptersSeed,
          sections: sectionsSeed,
          contentElements: contentElementsSeed
        }
      }
    );

    const entryStructure = result.current;

    expect(entryStructure).toMatchObject(expectedEntryStructure);
    expect(entryStructure.mainSectionsCount).toBe(2);
  });
});

describe('useSectionsWithChapter', () => {
  it('returns sections with nested chapter object', () => {
    const {result} = renderHookInEntry(
      () => useSectionsWithChapter(),
      {
        seed: {
          chapters: chaptersSeed,
          sections: sectionsSeed
        }
      }
    );

    const section = result.current;

    expect(section).toMatchObject([
      {
        permaId: 101,
        sectionIndex: 0,
        chapter: {
          permaId: 10,
          chapterSlug: 'chapter-1',
          title: 'Chapter 1',
          summary: 'An introductory chapter'
        },
        transition: 'scroll'
      },
      {
        permaId: 102,
        sectionIndex: 1,
        chapter: {
          permaId: 11,
          chapterSlug: 'chapter-2',
          title: 'Chapter 2',
          summary: 'A great chapter'
        },
        transition: 'fade'
      },
      {
        permaId: 103,
        sectionIndex: 2,
        chapter: {
          permaId: 12,
          chapterSlug: 'some-excursion',
          title: 'Some excursion'
        },
        transition: 'scroll'
      }
    ]);
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

  it('does not mark section as fullHeight by default', () => {
    const {result} = renderHookInEntry(
      () => useSection({sectionPermaId: 101}),
      {
        seed: {
          sections: [{permaId: 101}]
        }
      }
    );

    const section = result.current;

    expect(section.fullHeight).toBeUndefined()
  });

  it('marks sections with backdropType contentElement as fullHeight', () => {
    const {result} = renderHookInEntry(
      () => useSection({sectionPermaId: 101}),
      {
        seed: {
          sections: [{permaId: 101, configuration: {backdropType: 'contentElement'}}],
        }
      }
    );

    const section = result.current;

    expect(section.fullHeight).toEqual(true)
  });

  it('overrides fullHeight to true for backdropType contentElement', () => {
    const {result} = renderHookInEntry(
      () => useSection({sectionPermaId: 101}),
      {
        seed: {
          sections: [{
            permaId: 101,
            configuration: {
              fullHeight: false,
              backdropType: 'contentElement'
            }
          }],
        }
      }
    );

    const section = result.current;

    expect(section.fullHeight).toEqual(true)
  });

  it('supports marking sections as fullHeight', () => {
    const {result} = renderHookInEntry(
      () => useSection({sectionPermaId: 101}),
      {
        seed: {
          sections: [{permaId: 101, configuration: {fullHeight: true}}],
        }
      }
    );

    const section = result.current;

    expect(section.fullHeight).toEqual(true)
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
        chapterSlug: 'chapter-1',
        index: 0,
        title: 'Chapter 1',
        summary: 'An introductory chapter'
      },
      {
        permaId: 11,
        chapterSlug: 'chapter-2',
        index: 1,
        title: 'Chapter 2',
        summary: 'A great chapter',
        hideInNavigation: true
      },
      {
        permaId: 12,
        chapterSlug: 'some-excursion',
        index: 2,
        title: 'Some excursion'
      }
    ]);
  });

  it('sanitizes chapter titles', () => {
    const {result} = renderHookInEntry(
      () => useChapters(),
      {
        seed: {
          chapters: [
            {
              configuration: {
                title: 'SmallCase',
              }
            },
            {
              configuration: {
                title: 'RemöveUmläütß',
              }
            },
            {
              configuration: {
                title: 'remove space',
              }
            },
            {
              configuration: {
                title: 'remove#special$character',
              }
            },

          ]
        }
      }
    );

    const chapters = result.current;

    expect(chapters).toMatchObject([
      {
        chapterSlug: "smallcase",
      },
      {
        chapterSlug: 'remoeveumlaeuetss',
      },
      {
        chapterSlug: 'remove-space',
      },
      {
        chapterSlug: 'removespecialdollarcharacter',
      }
    ]);
  });
});

describe('useMainChapters', () => {
  it('returns data for all chapters of main storyline', () => {
    const {result} = renderHookInEntry(
      () => useMainChapters(),
      {
        seed: {
          storylines: storylinesSeed,
          chapters: chaptersSeed
        }
      }
    );

    const chapters = result.current;

    expect(chapters).toMatchObject([
      {
        permaId: 10,
        chapterSlug: 'chapter-1',
      },
      {
        permaId: 11,
        chapterSlug: 'chapter-2',
      }
    ]);
  });
});

describe('useChapter', () => {
  it('returns data for one chapter', () => {
    const {result} = renderHookInEntry(
      () => useChapter({permaId: 10}),
      {
        seed: {
          chapters: [
            {permaId: 10, configuration: {title: 'The Intro'}}
          ]
        }
      }
    );

    const section = result.current;

    expect(section).toMatchObject({
      index: 0,
      permaId: 10,
      title: 'The Intro',
      chapterSlug: 'the-intro'
    });
  });
});

describe('useSectionForegroundContentElements', () => {
  it('returns list of content elements of section', () => {
    const {result} = renderHookInEntry(
      () => useSectionForegroundContentElements({sectionId: 2}),
      {
        seed: {
          chapters: chaptersSeed,
          sections: sectionsSeed,
          contentElements: contentElementsSeed
        }
      }
    );

    const contentElements = result.current;

    expect(contentElements).toMatchObject([
      {
        id: 3,
        permaId: 1003,
        type: 'image',
        position: 'sticky',
        width: 1,
        props: {
          imageId: 4
        }
      },
      {
        id: 4,
        permaId: 1004,
        type: 'image',
        position: 'side',
        width: 0,
        props: {
          imageId: 4
        }
      },
      {
        id: 5,
        permaId: 1005,
        type: 'textBlock',
        position: 'inline',
        width: 0,
        props: {
          children: 'Some more text'
        }
      }
    ]);
  });

  it('includes alignment of content elements', () => {
    const {result} = renderHookInEntry(
      () => useSectionForegroundContentElements({sectionId: 1}),
      {
        seed: {
          chapters: chaptersSeed,
          sections: sectionsSeed,
          contentElements: [...contentElementsSeed,
                            {id: 6,
                             permaId: 1006,
                             sectionId: 1,
                             typeName: 'textBlock',
                             configuration: {alignment: 'left', width: -1}}]
        }
      }
    );

    const contentElements = result.current;
    expect(contentElements).toEqual(expect.arrayContaining([
      expect.objectContaining({permaId: 1006, alignment: 'left'})
    ]));
  });

  it('filters out content elements with position backdrop', () => {
    const {result} = renderHookInEntry(
      () => useSectionForegroundContentElements({sectionId: 2}),
      {
        seed: {
          chapters: chaptersSeed,
          sections: sectionsSeed,
          contentElements: [
            {
              id: 1,
              permaId: 1001,
              sectionId: 2,
              typeName: 'image',
              configuration: {
                position: 'backdrop',
              }
            }
          ]
        }
      }
    );

    const contentElements = result.current;

    expect(contentElements).toMatchObject([]);
  });

  it('rewrites legacy full positions to inline with width', () => {
    const {result} = renderHookInEntry(
      () => useSectionForegroundContentElements({sectionId: 2}),
      {
        seed: {
          chapters: chaptersSeed,
          sections: sectionsSeed,
          contentElements: [
            {
              id: 1,
              permaId: 1001,
              sectionId: 2,
              typeName: 'image',
              configuration: {
                position: 'full',
              }
            }
          ]
        }
      }
    );

    const contentElements = result.current;

    expect(contentElements).toMatchObject([
      {
        id: 1,
        permaId: 1001,
        type: 'image',
        position: 'inline',
        width: 3
      }
    ]);
  });

  it('rewrites legacy wide positions to inline with width', () => {
    const {result} = renderHookInEntry(
      () => useSectionForegroundContentElements({sectionId: 2}),
      {
        seed: {
          chapters: chaptersSeed,
          sections: sectionsSeed,
          contentElements: [
            {
              id: 1,
              permaId: 1001,
              sectionId: 2,
              typeName: 'image',
              configuration: {
                position: 'wide',
              }
            }
          ]
        }
      }
    );

    const contentElements = result.current;

    expect(contentElements).toMatchObject([
      {
        id: 1,
        permaId: 1001,
        type: 'image',
        position: 'inline',
        width: 2
      }
    ]);
  });

  it('prefers configured width over width based on legacy positions', () => {
    const {result} = renderHookInEntry(
      () => useSectionForegroundContentElements({sectionId: 2}),
      {
        seed: {
          chapters: chaptersSeed,
          sections: sectionsSeed,
          contentElements: [
            {
              id: 1,
              permaId: 1001,
              sectionId: 2,
              typeName: 'image',
              configuration: {
                position: 'wide',
                width: 0
              }
            }
          ]
        }
      }
    );

    const contentElements = result.current;

    expect(contentElements).toMatchObject([
      {
        id: 1,
        permaId: 1001,
        type: 'image',
        position: 'inline',
        width: 0
      }
    ]);
  });

  it('turns floated positions into inline in left layout', () => {
    const {result} = renderHookInEntry(
      () => useSectionForegroundContentElements({sectionId: 2, layout: 'left'}),
      {
        seed: {
          chapters: chaptersSeed,
          sections: sectionsSeed,
          contentElements: [
            {
              id: 1,
              permaId: 1001,
              sectionId: 2,
              typeName: 'image',
              configuration: {
                position: 'left'
              }
            },
            {
              id: 2,
              permaId: 1002,
              sectionId: 2,
              typeName: 'image',
              configuration: {
                position: 'right'
              }
            }
          ]
        }
      }
    );

    const contentElements = result.current;

    expect(contentElements).toMatchObject([
      {
        id: 1,
        permaId: 1001,
        type: 'image',
        position: 'inline',
        width: 0
      },
      {
        id: 2,
        permaId: 1002,
        type: 'image',
        position: 'inline',
        width: 0
      }
    ]);
  });

  it('turns floated positions into inline in right layout', () => {
    const {result} = renderHookInEntry(
      () => useSectionForegroundContentElements({sectionId: 2, layout: 'right'}),
      {
        seed: {
          chapters: chaptersSeed,
          sections: sectionsSeed,
          contentElements: [
            {
              id: 1,
              permaId: 1001,
              sectionId: 2,
              typeName: 'image',
              configuration: {
                position: 'left'
              }
            },
            {
              id: 2,
              permaId: 1002,
              sectionId: 2,
              typeName: 'image',
              configuration: {
                position: 'right'
              }
            }
          ]
        }
      }
    );

    const contentElements = result.current;

    expect(contentElements).toMatchObject([
      {
        id: 1,
        permaId: 1001,
        type: 'image',
        position: 'inline',
        width: 0
      },
      {
        id: 2,
        permaId: 1002,
        type: 'image',
        position: 'inline',
        width: 0
      }
    ]);
  });

  it('turns sticky position into inline in centered layout', () => {
    const {result} = renderHookInEntry(
      () => useSectionForegroundContentElements({sectionId: 2, layout: 'center'}),
      {
        seed: {
          chapters: chaptersSeed,
          sections: sectionsSeed,
          contentElements: [
            {
              id: 1,
              permaId: 1001,
              sectionId: 2,
              typeName: 'image',
              configuration: {
                position: 'sticky'
              }
            }
          ]
        }
      }
    );

    const contentElements = result.current;

    expect(contentElements).toMatchObject([
      {
        id: 1,
        permaId: 1001,
        type: 'image',
        position: 'inline',
        width: 0
      }
    ]);
  });

  it('does not set standAlone flag by default', () => {
    const {result} = renderHookInEntry(
      () => useSectionForegroundContentElements({sectionId: 2, layout: 'center'}),
      {
        seed: {
          chapters: chaptersSeed,
          sections: sectionsSeed,
          contentElements: [
            {
              id: 1,
              permaId: 1001,
              sectionId: 2,
              typeName: 'image'
            }
          ]
        }
      }
    );

    const contentElements = result.current;

    expect(contentElements).toMatchObject([
      {
        id: 1,
        permaId: 1001,
        type: 'image',
        position: 'inline',
        standAlone: false
      }
    ]);
  });

  it('turns standAlone position into inline with standAlone flag', () => {
    const {result} = renderHookInEntry(
      () => useSectionForegroundContentElements({sectionId: 2, layout: 'center'}),
      {
        seed: {
          chapters: chaptersSeed,
          sections: sectionsSeed,
          contentElements: [
            {
              id: 1,
              permaId: 1001,
              sectionId: 2,
              typeName: 'image',
              configuration: {
                position: 'standAlone'
              }
            }
          ]
        }
      }
    );

    const contentElements = result.current;

    expect(contentElements).toMatchObject([
      {
        id: 1,
        permaId: 1001,
        type: 'image',
        position: 'inline',
        standAlone: true
      }
    ]);
  });

  it('clamps widths of floated elements in center layout', () => {
    const {result} = renderHookInEntry(
      () => useSectionForegroundContentElements({sectionId: 2, layout: 'center'}),
      {
        seed: {
          chapters: chaptersSeed,
          sections: sectionsSeed,
          contentElements: [
            {
              id: 1,
              permaId: 1001,
              sectionId: 2,
              typeName: 'image',
              configuration: {
                width: 3
              }
            },
            {
              id: 2,
              permaId: 1002,
              sectionId: 2,
              typeName: 'image',
              configuration: {
                position: 'left',
                width: 2
              }
            },
            {
              id: 3,
              permaId: 1003,
              sectionId: 2,
              typeName: 'image',
              configuration: {
                position: 'left',
                width: 3
              }
            },
            {
              id: 4,
              permaId: 1004,
              sectionId: 2,
              typeName: 'image',
              configuration: {
                position: 'right',
                width: -3
              }
            },
            {
              id: 5,
              permaId: 1005,
              sectionId: 2,
              typeName: 'image',
              configuration: {
                position: 'sticky',
                width: 3
              }
            }
          ]
        }
      }
    );

    const contentElements = result.current;

    expect(contentElements).toMatchObject([
      {
        id: 1,
        position: 'inline',
        width: 3
      },
      {
        id: 2,
        position: 'left',
        width: 2
      },
      {
        id: 3,
        position: 'left',
        width: 2
      },
      {
        id: 4,
        position: 'right',
        width: -2
      },
      {
        id: 5,
        position: 'inline',
        width: 3
      }
    ]);
  });

  it('clamps widths of sticky elements in two-column layout', () => {
    const {result} = renderHookInEntry(
      () => useSectionForegroundContentElements({sectionId: 2, layout: 'right'}),
      {
        seed: {
          chapters: chaptersSeed,
          sections: sectionsSeed,
          contentElements: [
            {
              id: 1,
              permaId: 1001,
              sectionId: 2,
              typeName: 'image',
              configuration: {
                width: 3
              }
            },
            {
              id: 2,
              permaId: 1002,
              sectionId: 2,
              typeName: 'image',
              configuration: {
                position: 'sticky',
                width: 2
              }
            },
            {
              id: 3,
              permaId: 1003,
              sectionId: 2,
              typeName: 'image',
              configuration: {
                position: 'sticky',
                width: 3
              }
            },
            {
              id: 4,
              permaId: 1004,
              sectionId: 2,
              typeName: 'image',
              configuration: {
                position: 'right',
                width: -3
              }
            }
          ]
        }
      }
    );

    const contentElements = result.current;

    expect(contentElements).toMatchObject([
      {
        id: 1,
        position: 'inline',
        width: 3
      },
      {
        id: 2,
        position: 'sticky',
        width: 2
      },
      {
        id: 3,
        position: 'sticky',
        width: 2
      },
      {
        id: 4,
        position: 'inline',
        width: -3
      }
    ]);
  });

  it('does not make fullWidthInPhoneLayout elements full width in desktop layout', () => {
    const {result} = renderHookInEntry(
      () => useSectionForegroundContentElements({sectionId: 2, layout: 'right', phoneLayout: false}),
      {
        seed: {
          chapters: chaptersSeed,
          sections: sectionsSeed,
          contentElements: [
            {
              id: 1,
              permaId: 1001,
              sectionId: 2,
              typeName: 'image',
              configuration: {
                width: 2,
                fullWidthInPhoneLayout: true
              }
            },
            {
              id: 2,
              permaId: 1002,
              sectionId: 2,
              typeName: 'image',
              configuration: {
                position: 'sticky',
                width: 1,
                fullWidthInPhoneLayout: true
              }
            }
          ]
        }
      }
    );

    const contentElements = result.current;

    expect(contentElements).toMatchObject([
      {
        id: 1,
        position: 'inline',
        width: 2
      },
      {
        id: 2,
        position: 'sticky',
        width: 1
      }
    ]);
  });

  it('makes fullWidthInPhoneLayout elements full width in phone layout', () => {
    const {result} = renderHookInEntry(
      () => useSectionForegroundContentElements({sectionId: 2, layout: 'right', phoneLayout: true}),
      {
        seed: {
          chapters: chaptersSeed,
          sections: sectionsSeed,
          contentElements: [
            {
              id: 1,
              permaId: 1001,
              sectionId: 2,
              typeName: 'image',
              configuration: {
                width: 2,
                fullWidthInPhoneLayout: true
              }
            },
            {
              id: 2,
              permaId: 1002,
              sectionId: 2,
              typeName: 'image',
              configuration: {
                position: 'sticky',
                width: 1,
                fullWidthInPhoneLayout: true
              }
            },
            {
              id: 3,
              permaId: 1003,
              sectionId: 2,
              typeName: 'image',
              configuration: {
                width: 1
              }
            }
          ]
        }
      }
    );

    const contentElements = result.current;

    expect(contentElements).toMatchObject([
      {
        id: 1,
        position: 'inline',
        width: 3
      },
      {
        id: 2,
        position: 'inline',
        width: 3
      },
      {
        id: 3,
        position: 'inline',
        width: 1
      }
    ]);
  });
});

describe('useContentElement', () => {
  it('looks up content element by perma id', () => {
    const {result} = renderHookInEntry(
      () => useContentElement({permaId: 10}),
      {
        seed: {
          contentElements: [
            {
              id: 4,
              permaId: 10,
              typeName: 'inlineVideo',
              configuration: {video: 6}
            }
          ]
        }
      }
    );

    const contentElement = result.current;

    expect(contentElement).toMatchObject({
      id: 4,
      permaId: 10,
      type: 'inlineVideo',
      position: 'inline',
      width: 0,
      props: {
        video: 6
      }
    });
  });

  it('returns undefined for unknown perma id', () => {
    const {result} = renderHookInEntry(
      () => useContentElement({permaId: 10}),
      {
        seed: {
          contentElements: []
        }
      }
    );

    const contentElement = result.current;

    expect(contentElement).toBeUndefined();
  });
});
