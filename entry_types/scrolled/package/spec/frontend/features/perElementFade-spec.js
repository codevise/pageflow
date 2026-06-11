import {renderEntry, usePageObjects} from 'support/pageObjects';
import {useSectionMatchers} from 'support/matchers';

describe('fade transitions with backdrop blur', () => {
  usePageObjects();
  useSectionMatchers();

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

    expect(getSectionByPermaId(10)).toHavePerElementFadeTransition();
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

    expect(getSectionByPermaId(10)).not.toHavePerElementFadeTransition();
  });
});
