import {renderEntry, usePageObjects} from 'support/pageObjects';

import {act} from '@testing-library/react';
import {fakeParentWindow, tick} from 'support';

import useScrollTarget from 'frontend/useScrollTarget';
jest.mock('frontend/useScrollTarget');

describe('SCROLL_TO_SECTION message', () => {
  usePageObjects();

  beforeEach(() => {
    fakeParentWindow()
  });

  it('scrolls to scene with given index', async () => {
    const {getSectionByPermaId} = renderEntry({
      seed: {
        sections: [
          {permaId: 10},
          {permaId: 11}
        ]
      }
    });

    await act(async () => {
      window.postMessage({type: 'SCROLL_TO_SECTION', payload: {index: 1}}, '*');
      await tick(); // Make sure async handling of message is wrapped in act
    });

    expect(useScrollTarget.lastTarget).toBe(getSectionByPermaId(11).el);
  });
});
