import 'widgets/excursionSheet';

import {renderEntry, usePageObjects} from 'support/pageObjects';
import {fakeParentWindow} from 'support';
import {changeLocationHash} from 'support/changeLocationHash';
import 'support/viewTimelineStub';
import 'support/animateStub';
import {act} from '@testing-library/react';

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

  it('is posted when section becomes active in excursion', () => {
    const {getSectionByPermaId} = renderEntry({
      seed: {
        widgets: [{
          typeName: 'excursionSheet',
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
          {
            permaId: 10,
            chapterId: 1
          },
          {
            permaId: 11,
            chapterId: 1
          }
        ]
      }
    });

    act(() => changeLocationHash('#some-excursion'));
    getSectionByPermaId(11).simulateScrollingIntoView();

    expect(window.parent.postMessage).toHaveBeenCalledWith({
      type: 'CHANGE_SECTION',
      payload: {index: 1}
    }, expect.anything());
  });
});
