import React from 'react';

import {frontend} from 'frontend';

import {renderEntry, usePageObjects} from 'support/pageObjects';
import '@testing-library/jest-dom/extend-expect'

describe('rendering excursions', () => {
  usePageObjects();

  it('does not render excursion if no widget is present', () => {
    frontend.contentElementTypes.register('text', {
      component: function ({configuration}) {
        return (
          <div>{configuration.text}</div>
        )
      }
    });

    const {container} = renderEntry({
      seed: {
        storylines: [
          {
            id: 1,
            configuration: {main: true}
          },
          {
            id: 2
          }
        ],
        chapters: [
          {id: 1, storylineId: 2}
        ],
        sections: [
          {id: 1, chapterId: 1}
        ],
        contentElements: [
          {
            typeName: 'text',
            sectionId: 1,
            configuration: {
              text: 'Some text'
            }
          }
        ]
      }
    });

    expect(container).not.toHaveTextContent('Some text');
  });

  it('wraps excursion in widget', () => {
    frontend.widgetTypes.register('excursionOverlay', {
      component: function ({configuration, children}) {
        return (
          <div data-testid="test-overlay">{children}</div>
        )
      }
    });

    frontend.contentElementTypes.register('text', {
      component: function ({configuration}) {
        return (
          <div>{configuration.text}</div>
        )
      }
    });

    const {getByTestId} = renderEntry({
      seed: {
        widgets: [{
          typeName: 'excursionOverlay',
          role: 'excursion'
        }],
        storylines: [
          {
            id: 1,
            configuration: {main: true}
          },
          {
            id: 2
          }
        ],
        chapters: [
          {id: 1, storylineId: 2}
        ],
        sections: [
          {id: 1, chapterId: 1}
        ],
        contentElements: [
          {
            typeName: 'text',
            sectionId: 1,
            configuration: {
              text: 'Some text'
            }
          }
        ]
      }
    });

    expect(getByTestId('test-overlay')).toHaveTextContent('Some text');
  });
});
