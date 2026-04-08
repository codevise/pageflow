import React from 'react';
import {frontend} from 'frontend';
import {features} from 'pageflow/frontend';

import {useInlineEditingPageObjects, renderEntry} from 'support/pageObjects';
import {fakeParentWindow} from 'support';
import {changeLocationHash} from 'support/changeLocationHash';
import '@testing-library/jest-dom/extend-expect'
import {act, fireEvent, waitFor} from '@testing-library/react';

describe('content element selection', () => {
  useInlineEditingPageObjects();

  beforeEach(() => {
    fakeParentWindow()
    window.parent.postMessage = jest.fn();
    window.location.hash = '#initial';
  });

  it('marks selection rect as selected when clicked', () => {
    const {getContentElementByTestId} = renderEntry({
      seed: {
        contentElements: [{
          typeName: 'withTestId',
          configuration: {testId: 5}
        }]
      }
    });

    const contentElement = getContentElementByTestId(5);

    expect(contentElement.isSelected()).toBe(false);

    contentElement.select();

    expect(contentElement.isSelected()).toBe(true);
  });

  it('marks main storyline selection rect as not selected when excursion becomes active', () => {
    frontend.widgetTypes.register('excursionOverlay', {
      component: function ({children}) {
        return (
          <div data-testid="excursion-overlay">
            {children}
          </div>
        )
      }
    });

    frontend.contentElementTypes.register('text', {
      component: function ({configuration}) {
        return <div>{configuration.text}</div>
      }
    });

    const {getContentElementByTestId} = renderEntry({
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
          {id: 1, storylineId: 1},
          {id: 2, storylineId: 2, configuration: {title: 'test-excursion'}}
        ],
        sections: [
          {id: 1, chapterId: 1},
          {id: 2, chapterId: 2}
        ],
        contentElements: [
          {
            typeName: 'withTestId',
            sectionId: 1,
            configuration: {testId: 'main'}
          },
          {
            typeName: 'text',
            sectionId: 2,
            configuration: {text: 'Excursion content'}
          }
        ]
      }
    });

    const mainContentElement = getContentElementByTestId('main');

    mainContentElement.select();
    expect(mainContentElement.isSelected()).toBe(true);

    act(() => changeLocationHash('#test-excursion'));

    expect(mainContentElement.isSelected()).toBe(false);
  });

  it('marks selection rect as selected when comment badge is clicked', async () => {
    features.enable('frontend', ['commenting']);

    const {getByRole, getContentElementByTestId} = renderEntry({
      seed: {
        contentElements: [{
          id: 1,
          permaId: 10,
          typeName: 'withTestId',
          configuration: {testId: 5}
        }]
      }
    });

    act(() => {
      window.dispatchEvent(new MessageEvent('message', {
        data: {
          type: 'REVIEW_STATE_RESET',
          payload: {
            currentUser: {id: 1},
            commentThreads: [{
              id: 1,
              subjectType: 'ContentElement',
              subjectId: 10,
              comments: [{id: 100, body: 'Review this'}]
            }]
          }
        },
        origin: window.location.origin
      }));
    });

    await waitFor(() => {
      expect(getByRole('status')).toBeInTheDocument();
    });

    const contentElement = getContentElementByTestId(5);
    expect(contentElement.isSelected()).toBe(false);

    fireEvent.click(getByRole('status'));

    expect(contentElement.isSelected()).toBe(true);
  });
});
