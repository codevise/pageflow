import {renderEntry, usePageObjects} from 'support/pageObjects';
import {fakeParentWindow} from 'support';

import {asyncHandlingOf} from 'support/asyncHandlingOf';

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

    await asyncHandlingOf(() => {
      window.postMessage({type: 'SCROLL_TO_SECTION', payload: {index: 1}}, '*');
    });

    expect(useScrollTarget.lastTarget).toBe(getSectionByPermaId(11).el);
  });
});
