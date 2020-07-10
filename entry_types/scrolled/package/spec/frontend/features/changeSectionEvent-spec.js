import {renderEntry} from 'support/pageObjects';
import {events} from 'pageflow/frontend';

describe('change section event', () => {
  beforeEach(() => {
    events.trigger = jest.fn();
  });

  it('is triggered when section becomes active', () => {
    const {getSectionByPermaId} = renderEntry({
      seed: {
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
          {sectionIndex: 0, permaId: 10, chapterId: 1},
          {sectionIndex: 1, permaId: 11, chapterId: 2}
        ]
      }
    });

    getSectionByPermaId(11).simulateScrollingIntoView();

    expect(events.trigger).toHaveBeenCalledWith(
      'page:change',
      {
        configuration: {
          title: expect.stringContaining('Destination of Species, Section 1')
        },
        index: 1
      }
    );
  });
});
