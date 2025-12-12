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

  it('scrolls to bottom of section with 25% offset when align is nearEnd', async () => {
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
      10: {top: -100, height: 800},
      11: {top: 700}
    });

    await asyncHandlingOf(() => {
      window.postMessage({type: 'SCROLL_TO_SECTION', payload: {id: 100, align: 'nearEnd'}}, '*');
    });

    // Scroll so bottom of section is at 25% from viewport bottom (75% from top)
    // offset = height - innerHeight * 0.75 = 800 - 750 = 50
    // top = -100 + 1000 + 50 = 950
    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 950,
      behavior: 'smooth'
    });
  });

  it('does not scroll when ifNeeded is true and section top is visible with default align', async () => {
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
      10: {top: 100, height: 800},
      11: {top: 900}
    });

    await asyncHandlingOf(() => {
      window.postMessage({type: 'SCROLL_TO_SECTION', payload: {id: 100, ifNeeded: true}}, '*');
    });

    expect(window.scrollTo).not.toHaveBeenCalled();
  });

  it('scrolls when ifNeeded is true and section top is above viewport with default align', async () => {
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
      10: {top: -100, height: 800},
      11: {top: 700}
    });

    await asyncHandlingOf(() => {
      window.postMessage({type: 'SCROLL_TO_SECTION', payload: {id: 100, ifNeeded: true}}, '*');
    });

    expect(window.scrollTo).toHaveBeenCalled();
  });

  it('does not scroll when ifNeeded is true and section top is visible', async () => {
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
      10: {top: 100, height: 800},
      11: {top: 900}
    });

    await asyncHandlingOf(() => {
      window.postMessage({type: 'SCROLL_TO_SECTION', payload: {id: 100, align: 'start', ifNeeded: true}}, '*');
    });

    expect(window.scrollTo).not.toHaveBeenCalled();
  });

  it('scrolls when ifNeeded is true and section top is above viewport', async () => {
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
      10: {top: -100, height: 800},
      11: {top: 700}
    });

    await asyncHandlingOf(() => {
      window.postMessage({type: 'SCROLL_TO_SECTION', payload: {id: 100, align: 'start', ifNeeded: true}}, '*');
    });

    expect(window.scrollTo).toHaveBeenCalled();
  });

  it('does not scroll when ifNeeded is true and section bottom is visible for nearEnd', async () => {
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
      10: {top: 100, height: 800},
      11: {top: 900}
    });

    await asyncHandlingOf(() => {
      window.postMessage({type: 'SCROLL_TO_SECTION', payload: {id: 100, align: 'nearEnd', ifNeeded: true}}, '*');
    });

    expect(window.scrollTo).not.toHaveBeenCalled();
  });

  it('scrolls when ifNeeded is true and section bottom is below viewport for nearEnd', async () => {
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
      10: {top: 300, height: 800},
      11: {top: 1100}
    });

    await asyncHandlingOf(() => {
      window.postMessage({type: 'SCROLL_TO_SECTION', payload: {id: 100, align: 'nearEnd', ifNeeded: true}}, '*');
    });

    expect(window.scrollTo).toHaveBeenCalled();
  });

  it('activates excursion of section', async () => {
    renderEntry({
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
