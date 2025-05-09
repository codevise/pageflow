import {renderEntry, usePageObjects} from 'support/pageObjects';
import {fakeParentWindow} from 'support';

import {asyncHandlingOf} from 'support/asyncHandlingOf';

describe('SCROLL_TO_SECTION message', () => {
  usePageObjects();

  beforeEach(() => {
    fakeParentWindow()
    window.scrollTo = jest.fn();
    window.location.hash = '#initial';
  });

  it('scrolls to section with given id', async () => {
    const {fakeSectionBoundingClientRectsByPermaId} = renderEntry({
      seed: {
        sections: [
          {id: 100, permaId: 10},
          {id: 101, permaId: 11}
        ]
      }
    });

    window.scrollY = 1000;
    window.innerHeight = 1000
    fakeSectionBoundingClientRectsByPermaId({
      10: {top: -100},
      11: {top: 30}
    });

    await asyncHandlingOf(() => {
      window.postMessage({type: 'SCROLL_TO_SECTION', payload: {id: 100}}, '*');
    });

    expect(window.scrollTo).toHaveBeenCalledWith({
      top: -100 + 1000 - 250,
      behavior: 'smooth'
    });
  });

  it('scrolls to top section when align is start', async () => {
    const {fakeSectionBoundingClientRectsByPermaId} = renderEntry({
      seed: {
        sections: [
          {id: 100, permaId: 10},
          {id: 101, permaId: 11}
        ]
      }
    });

    window.scrollY = 1000;
    window.innerHeight = 1000
    fakeSectionBoundingClientRectsByPermaId({
      10: {top: -100},
      11: {top: 30}
    });

    await asyncHandlingOf(() => {
      window.postMessage({type: 'SCROLL_TO_SECTION', payload: {id: 100, align: 'start'}}, '*');
    });

    expect(window.scrollTo).toHaveBeenCalledWith({
      top: -100 + 1000,
      behavior: 'smooth'
    });
  });

  it('activates excursion of section', async () => {
    const {fakeSectionBoundingClientRectsByPermaId} = renderEntry({
      seed: {
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
          {id: 1, storylineId: 1},
          {id: 2, storylineId: 2, configuration: {title: 'some-excursion'}}
        ],
        sections: [
          {id: 100, permaId: 10, chapterId: 1},
          {id: 101, permaId: 11, chapterId: 2}
        ]
      }
    });

    await asyncHandlingOf(() => {
      window.postMessage({type: 'SCROLL_TO_SECTION', payload: {id: 101}}, '*');
    });

    expect(window.location.hash).toEqual('#some-excursion');
  });
});
