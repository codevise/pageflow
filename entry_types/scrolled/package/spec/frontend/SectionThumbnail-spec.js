import React from 'react';

import {ScrolledEntry} from 'editor/models/ScrolledEntry';
import {SectionThumbnail} from 'frontend/SectionThumbnail';
import {watchCollections} from 'entryState';
import 'contentElements/heading/frontend';

import {normalizeSeed} from 'support';
import {render, act} from '@testing-library/react';
import 'support/fakeIntersectionObserver';
import {factories} from 'pageflow/testHelpers';

describe('SectionThumbnail', () => {
  it('renders section with content elements', () => {
    const seed = normalizeSeed({
      sections: [
        {id: 3, permaId: 1},
      ],
      contentElements: [
        {
          sectionId: 3,
          typeName: 'heading',
          configuration: {children: 'Some Heading'}
        }
      ]
    });
    const {getByText} = render(<SectionThumbnail seed={seed} sectionPermaId={1} />);

    expect(getByText('Some Heading')).toBeDefined();
  });

  it('supports subscribing to collection', () => {
    const entry = factories.entry(ScrolledEntry, {}, {
      entryTypeSeed: normalizeSeed({
        sections: [
          {id: 3, permaId: 1},
        ],
        contentElements: [
          {
            sectionId: 3,
            typeName: 'heading',
            configuration: {children: 'Some Heading'}
          }
        ]
      })
    });

    const {getByText} = render(<SectionThumbnail
                                   seed={normalizeSeed()}
                                   subscribe={dispatch => watchCollections(
                                       entry,
                                       {dispatch}
                                     )}
                                   sectionPermaId={1} />);
    expect(getByText('Some Heading')).toBeDefined();
  });

  it('unsubscribed on unmount', () => {
    const entry = factories.entry(ScrolledEntry, {}, {
      entryTypeSeed: normalizeSeed({
        sections: [
          {id: 3, permaId: 1},
        ],
        contentElements: [
          {
            sectionId: 3,
            typeName: 'heading',
            configuration: {children: 'Some Heading'}
          }
        ]
      })
    });
    const consoleError = jest.spyOn(global.console, 'error')

    const {unmount} = render(<SectionThumbnail
                                 seed={normalizeSeed()}
                                 subscribe={dispatch => watchCollections(
                                     entry,
                                     {dispatch}
                                   )}
                                 sectionPermaId={1} />);
    unmount();
    act(() => { entry.contentElements.sort() });

    expect(consoleError).not.toHaveBeenCalled();
  });
});
