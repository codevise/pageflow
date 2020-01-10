import {useEntryStructure, useFile, watchCollections} from 'entryState';

import {
  ChaptersCollection,
  SectionsCollection,
  ContentElementsCollection
} from 'editor/collections';

import {renderHookInEntry} from 'support';

describe('useEntryStructure', () => {
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

  describe('rendering sectionsWithNestedContentElements', () => {
    const expectedEntryStructure = [
      {
        title: 'Chapter 1',
        summary: 'An introductory chapter',
        sections: [
          {
            transition: 'scroll',
            foreground: [
              {
                type: 'heading',
                props: {
                  children: 'Heading'
                }
              },
              {
                type: 'textBlock',
                props: {
                  children: 'Some text'
                }
              }
            ]
          }
        ],
      },
      {
        title: 'Chapter 2',
        summary: 'A great chapter',
        sections: [
          {
            transition: 'fade',
            foreground: [
              {
                type: 'image',
                position: 'sticky',
                props: {
                  imageId: 4
                }
              },
              {
                type: 'textBlock',
                props: {
                  children: 'Some more text'
                }
              }
            ]
          }
        ]
      }
    ];

    it('reads data from watched collections', () => {
      const {result} = renderHookInEntry(() => useEntryStructure(), {
        setup: dispatch => {
          const chapters = new ChaptersCollection(chaptersSeed);
          const sections = new SectionsCollection(sectionsSeed);
          const contentElements = new ContentElementsCollection(contentElementsSeed);

          watchCollections(
            {chapters, sections, contentElements, files: {}},
            {dispatch}
          )
        }
      });
      const entryStructure = result.current;

      expect(entryStructure).toMatchObject(expectedEntryStructure);
    });

    it('reads data from seed passed to hook', () => {
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
});

describe('useFile', () => {
  it('reads data through EntryStateProvider from seed passed to useEntryState', () => {
    const {result} = renderHookInEntry(
      () => useFile({collectionName: 'imageFiles', permaId: 1}),
      {
        seed: {
          fileUrlTemplates: {
            imageFiles: {
              high: '/image_files/:id_partition/high.jpg'
            }
          },
          imageFiles: [
            {
              id: 100,
              permaId: 1,
              basename: 'image',
              rights: 'author',
              configuration: {
                some: 'value'
              }
            }
          ]
        }
      }
    );

    const file = result.current;

    expect(file).toMatchObject({
      id: 100,
      permaId: 1,
      configuration: {
        some: 'value'
      },
      urls: {
        high: '/image_files/000/000/100/high.jpg'
      }
    });
  });

  it('reads data through EntryStateProvider from watched collection', () => {
    const {result} = renderHookInEntry(
      () => useFile({collectionName: 'imageFiles', permaId: 1}),
      {
        seed: {
          fileUrlTemplates: {
            imageFiles: {
              high: '/image_files/:id_partition/high.jpg'
            }
          }
        },
        setup: dispatch => {
          watchCollections({
            chapters: new ChaptersCollection(),
            sections: new SectionsCollection(),
            contentElements: new ContentElementsCollection(),
            files: {
              image_files: new SectionsCollection([
                {
                  id: 100,
                  perma_id: 1,
                  basename: 'image',
                  rights: 'author',
                  configuration: {
                    some: 'value'
                  }
                }
              ])
            }
          }, {dispatch})
        }
      }
    );

    const file = result.current;

    expect(file).toMatchObject({
      id: 100,
      permaId: 1,
      configuration: {
        some: 'value'
      },
      urls: {
        high: '/image_files/000/000/100/high.jpg'
      }
    });
  });
});
