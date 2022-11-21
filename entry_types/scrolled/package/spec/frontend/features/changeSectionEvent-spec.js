import {renderEntry} from 'support/pageObjects';
import {events} from 'pageflow/frontend';

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
});
