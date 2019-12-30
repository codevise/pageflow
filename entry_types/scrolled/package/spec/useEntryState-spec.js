import {useEntryState, watchCollections} from 'useEntryState';
import {SectionsCollection, ContentElementsCollection} from 'editor/collections';

import {renderHook, act} from '@testing-library/react-hooks';

describe('useEntryState', () => {
  const sectionsSeed = [
    {
      id: 1,
      permaId: 10,
      position: 1,
      configuration: {
        transition: 'scroll'
      }
    },
    {
      id: 2,
      permaId: 20,
      position: 2,
      configuration: {
        transition: 'fade'
      }
    }
  ];
  const contentElementsSeed = [
    {
      id: 1,
      permaId: 101,
      sectionId: 1,
      typeName: 'heading',
      configuration: {
        children: 'Heading'
      }
    },
    {
      id: 2,
      permaId: 102,
      sectionId: 1,
      typeName: 'textBlock',
      configuration: {
        children: 'Some text'
      }
    },
    {
      id: 3,
      permaId: 103,
      sectionId: 2,
      typeName: 'image',
      configuration: {
        position: 'sticky',
        imageId: 4
      }
    },
    {
      id: 4,
      permaId: 104,
      sectionId: 2,
      typeName: 'textBlock',
      configuration: {
        children: 'Some more text'
      }
    }
  ];

  const expectedSectionsWithNestedContentElements = [
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
    },
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
  ];

  it('reads data from watched collections', () => {
    const {result} = renderHook(() => useEntryState());
    const sections = new SectionsCollection(sectionsSeed);
    const contentElements = new ContentElementsCollection(contentElementsSeed);

    act(() => {
      const [, dispatch] = result.current;
      watchCollections({sections, contentElements}, {dispatch});
    });
    const [{sectionsWithNestedContentElements},] = result.current;

    expect(sectionsWithNestedContentElements).toMatchObject(expectedSectionsWithNestedContentElements);
  });

  it('reads data from seed passed to hook', () => {
    const {result} = renderHook(() => useEntryState({
      sections: sectionsSeed,
      contentElements: contentElementsSeed
    }));

    const [{sectionsWithNestedContentElements},] = result.current;

    expect(sectionsWithNestedContentElements).toMatchObject(expectedSectionsWithNestedContentElements);
  });
});
