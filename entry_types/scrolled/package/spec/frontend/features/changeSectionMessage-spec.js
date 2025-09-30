import 'widgets/excursionSheet';

import {renderEntry, usePageObjects} from 'support/pageObjects';
import {fakeParentWindow} from 'support';
import {changeLocationHash} from 'support/changeLocationHash';
import {useFakeTranslations} from 'pageflow/testHelpers';
import 'support/viewTimelineStub';
import 'support/animateStub';
import {act} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('CHANGE_SECTION message', () => {
  usePageObjects();

  useFakeTranslations({
    'pageflow_scrolled.public.close': 'Close'
  });

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
      payload: {sectionIndex: 1, excursionId: undefined}
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
      payload: {sectionIndex: 1, excursionId: 1}
    }, expect.anything());
  });

  it('is posted when returning from excursion', async () => {
    const {getSectionByPermaId, getByRole} = renderEntry({
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
            storylineId: 1
          },
          {
            id: 2,
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
          },
          {
            permaId: 12,
            chapterId: 2
          }
        ]
      }
    });

    const user = userEvent.setup();

    getSectionByPermaId(11).simulateScrollingIntoView();
    act(() => changeLocationHash('#some-excursion'));
    window.parent.postMessage.mockClear();

    await user.click(getByRole('button', {name: 'Close'}));

    expect(window.parent.postMessage).toHaveBeenCalledWith({
      type: 'CHANGE_SECTION',
      payload: {sectionIndex: 1, excursionId: undefined}
    }, expect.anything());
  });
});
