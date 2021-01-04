import {renderEntry} from 'support/pageObjects';

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

  it('updates history state with chapter reference as fragment', () => {
    const {getSectionByPermaId} = renderEntry({
      seed: seedData
    });
    window.history.replaceState = jest.fn();
    getSectionByPermaId(11).simulateScrollingIntoView();

    expect(window.history.replaceState).toHaveBeenCalledWith(null, null, '#on-the-destination-of-species');
  })

});


