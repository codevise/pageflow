import {renderEntry, usePageObjects} from 'support/pageObjects';

describe('fade transitions with backdrop blur', () => {
  usePageObjects();

  it('uses per-element fade to preserve backdrop blur', () => {
    const {getSectionByPermaId} = renderEntry({
      seed: {
        sections: [
          {id: 1, permaId: 9, configuration: {fullHeight: true, transition: 'scroll'}},
          {id: 2, permaId: 10,
           configuration: {appearance: 'cards', cardSurfaceColor: '#ff000080',
                           fullHeight: true, transition: 'fade'}}
        ],
        contentElements: [{sectionId: 2}]
      }
    });

    expect(getSectionByPermaId(10).usesPerElementFadeTransition()).toBe(true);
  });

  it('uses regular fade when there is no backdrop blur', () => {
    const {getSectionByPermaId} = renderEntry({
      seed: {
        sections: [
          {id: 1, permaId: 9, configuration: {fullHeight: true, transition: 'scroll'}},
          {id: 2, permaId: 10,
           configuration: {appearance: 'cards', cardSurfaceColor: '#ff0000',
                           fullHeight: true, transition: 'fade'}}
        ],
        contentElements: [{sectionId: 2}]
      }
    });

    expect(getSectionByPermaId(10).usesPerElementFadeTransition()).toBe(false);
  });
});
