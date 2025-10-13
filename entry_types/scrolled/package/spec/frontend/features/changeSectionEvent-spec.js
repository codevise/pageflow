import 'widgets/excursionSheet';

import {renderEntry} from 'support/pageObjects';
import {events} from 'pageflow/frontend';
import {changeLocationHash} from 'support/changeLocationHash';
import {act} from '@testing-library/react';
import 'support/viewTimelineStub';
import 'support/animateStub';

const seedData = {
  chapters: [
    {
      id: 1,
      permaId: 10,
      position: 1,
      configuration: {
        title: 'On the Origin of Species'
      }
    },
    {
      id: 2,
      permaId: 11,
      position: 2,
      configuration: {
        title: 'On the Destination of Species'
      }
    }
  ],
  sections: [
    {permaId: 10, chapterId: 1},
    {permaId: 11, chapterId: 2}
  ]
}

describe('change section event', () => {
  it('is triggered when section becomes active', () => {
    events.trigger = jest.fn()

    const {getSectionByPermaId} = renderEntry({
      seed: seedData
    });

    getSectionByPermaId(11).simulateScrollingIntoView();

    expect(events.trigger).toHaveBeenCalledWith(
      'page:change',
      expect.objectContaining({
        configuration: {
          title: expect.stringContaining('Destination of Species, Section 1')
        },
        index: 1
      })
    );
  });

  it('provides getAnalyticsData on event object', () => {
    const spy = jest.fn();
    events.trigger = function(event, payload) {
      spy(event, payload.getAnalyticsData());
    };

    const {getSectionByPermaId} = renderEntry({
      seed: seedData
    });

    getSectionByPermaId(11).simulateScrollingIntoView();

    expect(spy).toHaveBeenCalledWith(
      'page:change',
      {
        chapterIndex: 1,
        chapterTitle: 'On the Destination of Species',

        index: 1,
        total: 2
      }
    );
  });

  it('is triggered when section becomes active in excursion', () => {
    events.trigger = jest.fn();

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
              title: 'Some Excursion'
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
            chapterId: 1
          }
        ]
      }
    });

    act(() => changeLocationHash('#some-excursion'));
    getSectionByPermaId(11).simulateScrollingIntoView();

    expect(events.trigger).toHaveBeenCalledWith(
      'page:change',
      expect.objectContaining({
        configuration: {
          title: expect.stringContaining('Some Excursion, Section 1')
        },
        index: 1
      })
    );
  });

  it('uses excursion section count for total in analytics data', () => {
    const spy = jest.fn();
    events.trigger = function(event, payload) {
      spy(event, payload.getAnalyticsData());
    };

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
            storylineId: 1
          },
          {
            id: 2,
            storylineId: 2,
            configuration: {
              title: 'Some Excursion'
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
          },
          {
            permaId: 13,
            chapterId: 2
          },
          {
            permaId: 14,
            chapterId: 2
          }
        ]
      }
    });

    act(() => changeLocationHash('#some-excursion'));
    getSectionByPermaId(13).simulateScrollingIntoView();

    expect(spy).toHaveBeenCalledWith(
      'page:change',
      expect.objectContaining({
        total: 3
      })
    );
  });
});
