import React from 'react';

import {frontend} from 'frontend';

import {renderEntry, usePageObjects} from 'support/pageObjects';
import {changeLocationHash} from 'support/changeLocationHash';
import '@testing-library/jest-dom/extend-expect'
import {act} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('rendering excursions', () => {
  usePageObjects();

  beforeEach(() => window.location.hash = '#initial');

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
      component: function ({excursion, children}) {
        return (
          <div data-testid="test-overlay">
            <h3>{excursion.customTitle}</h3>
            {children}
          </div>
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
          {
            id: 1,
            storylineId: 2,
            configuration: {
              title: 'some-excursion',
              customTitle: 'Some title'
            }
          }
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
    act(() => changeLocationHash('#some-excursion'));

    expect(getByTestId('test-overlay')).toHaveTextContent('Some title');
    expect(getByTestId('test-overlay')).toHaveTextContent('Some text');
  });

  it('returns from excursion when onClose callback is invoked', async () => {
    frontend.widgetTypes.register('excursionOverlay', {
      component: function ({onClose, children}) {
        return (
          <div data-testid="test-overlay">
            <button onClick={onClose}>Close</button>
            {children}
          </div>
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

    const {container, getByRole, getSectionByPermaId} = renderEntry({
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
          {id: 1, storylineId: 2, configuration: {title: 'some-excursion'}}
        ],
        sections: [
          {id: 1, permaId: 10, chapterId: 1}
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
    const user = userEvent.setup();

    act(() => changeLocationHash('#some-excursion'));
    getSectionByPermaId(10).simulateScrollingIntoView();
    await user.click(getByRole('button', {name: 'Close'}));

    expect(window.location.hash).toEqual('#initial');
    expect(container).not.toHaveTextContent('Some text');
  });
});
