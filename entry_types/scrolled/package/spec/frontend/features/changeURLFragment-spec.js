import 'widgets/excursionSheet';

import {renderEntry} from 'support/pageObjects';
import {changeLocationHash} from 'support/changeLocationHash';
import 'support/viewTimelineStub';
import 'support/animateStub';
import {act} from '@testing-library/react';

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
    {sectionIndex: 0, permaId: 10, chapterId: 1},
    {sectionIndex: 1, permaId: 11, chapterId: 2}
  ]
}

describe('change url fragment on section update', () => {
  it('resets fragment when scrolling back to top', () => {
    const {getSectionByPermaId} = renderEntry({
      seed: seedData
    });
    window.history.replaceState = jest.fn();

    getSectionByPermaId(11).simulateScrollingIntoView();
    window.history.replaceState.mockReset();
    getSectionByPermaId(10).simulateScrollingIntoView();

    expect(window.history.replaceState).toHaveBeenCalledWith(
      null, null, 'https://story.example.com/'
    );
  });

  it('updates history state with chapter reference as fragment', () => {
    const {getSectionByPermaId} = renderEntry({
      seed: seedData
    });
    window.history.replaceState = jest.fn();

    getSectionByPermaId(11).simulateScrollingIntoView();

    expect(window.history.replaceState).toHaveBeenCalledWith(null, null, '#on-the-destination-of-species');
  });

  it('updates history state with chapter reference as fragment in excursion', () => {
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
            permaId: 20,
            configuration: {
              title: 'some-excursion',
              customTitle: 'Some Excursion Title'
            }
          }
        ],
        sections: [
          {
            permaId: 10,
            chapterId: 1,
            sectionIndex: 0
          },
          {
            permaId: 11,
            chapterId: 1,
            sectionIndex: 1
          }
        ]
      }
    });
    window.history.replaceState = jest.fn();

    act(() => changeLocationHash('#some-excursion'));
    getSectionByPermaId(11).simulateScrollingIntoView();

    expect(window.history.replaceState).toHaveBeenCalledWith(null, null, '#some-excursion');
  });

  it('keeps hash when scrolling to first section in excursion', () => {
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
            permaId: 20,
            configuration: {
              title: 'some-excursion',
              customTitle: 'Some Excursion Title'
            }
          }
        ],
        sections: [
          {
            permaId: 10,
            chapterId: 1,
            sectionIndex: 0
          },
          {
            permaId: 11,
            chapterId: 1,
            sectionIndex: 1
          }
        ]
      }
    });
    window.history.replaceState = jest.fn();

    act(() => changeLocationHash('#some-excursion'));
    getSectionByPermaId(11).simulateScrollingIntoView();
    window.history.replaceState.mockReset();
    getSectionByPermaId(10).simulateScrollingIntoView();

    expect(window.history.replaceState).toHaveBeenCalledWith(null, null, '#some-excursion');
  });
});
