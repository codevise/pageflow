import React from 'react';

import Entry from 'frontend/Entry';

import {act} from '@testing-library/react';
import {renderInEntry, fakeParentWindow, tick} from 'support';
import {simulateScrollingIntoView} from 'support/fakeIntersectionObserver';

import useScrollTarget from 'frontend/useScrollTarget';
jest.mock('frontend/useScrollTarget');

describe('Entry', () => {
  it('posts CHANGE_SECTION message when section becomes active', () => {
    fakeParentWindow();
    window.parent.postMessage = jest.fn();

    const {container} = renderInEntry(<Entry />, {
      seed: {
        sections: [
          {permaId: 10},
          {permaId: 11}
        ]
      }
    });

    act(() =>
      simulateScrollingIntoView(container.querySelector('#section-11'))
    );

    expect(window.parent.postMessage).toHaveBeenCalledWith({
      type: 'CHANGE_SECTION',
      payload: {index: 1}
    }, expect.anything());
  });

  it('scrolls to scene passed via SCROLL_TO_SECTION message', async () => {
    fakeParentWindow();

    const {container} = renderInEntry(<Entry />, {
      seed: {
        sections: [
          {permaId: 10},
          {permaId: 11}
        ]
      }
    });

    await act(async () => {
      window.postMessage({type: 'SCROLL_TO_SECTION', payload: {index: 1}}, '*')
      await tick(); // Make sure async handling of message is wrapped in act
    });

    expect(useScrollTarget.lastTarget).toBe(container.querySelector('#section-11'));
  });
});
