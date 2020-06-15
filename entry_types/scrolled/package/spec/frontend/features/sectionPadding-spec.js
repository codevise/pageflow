import {renderEntry, useInlineEditingPageObjects} from 'support/pageObjects';

describe('section padding', () => {
  useInlineEditingPageObjects();

  it('adds padding to bottom of section by default', () => {
    const {getSectionByPermaId} = renderEntry({
      seed: {
        sections: [{id: 5, permaId: 6}],
        contentElements: [{sectionId: 5}]
      }
    });

    expect(getSectionByPermaId(6).hasBottomPadding()).toBe(true);
  });

  it('does not add padding to bottom of section if last content element is full width', () => {
    const {getSectionByPermaId} = renderEntry({
      seed: {
        sections: [{id: 5, permaId: 6}],
        contentElements: [{sectionId: 5, configuration: {position: 'full'}}]
      }
    });

    expect(getSectionByPermaId(6).hasBottomPadding()).toBe(false);
  });
});
