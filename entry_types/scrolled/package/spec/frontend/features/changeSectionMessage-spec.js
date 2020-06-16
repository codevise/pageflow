import {renderEntry, usePageObjects} from 'support/pageObjects';
import {fakeParentWindow} from 'support';

describe('CHANGE_SECTION message', () => {
  usePageObjects();

  beforeEach(() => {
    fakeParentWindow()
    window.parent.postMessage = jest.fn();
  });

  it('is posted when section becomes active', () => {
    const {getSectionByPermaId} = renderEntry({
      seed: {
        sections: [
          {permaId: 10},
          {permaId: 11}
        ]
      }
    });

    getSectionByPermaId(11).simulateScrollingIntoView();

    expect(window.parent.postMessage).toHaveBeenCalledWith({
      type: 'CHANGE_SECTION',
      payload: {index: 1}
    }, expect.anything());
  });
});
