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

  it('adds padding below full width element if section is selected', () => {
    const {getSectionByPermaId} = renderEntry({
      seed: {
        sections: [{id: 5, permaId: 6}],
        contentElements: [{sectionId: 5, configuration: {position: 'full'}}]
      }
    });

    const section = getSectionByPermaId(6);
    section.select();

    expect(section.hasBottomPadding()).toBe(true);
  });

  it('adds padding below full width element if element is selected', () => {
    const {getSectionByPermaId, getContentElementByTestId} = renderEntry({
      seed: {
        sections: [{id: 5, permaId: 6}],
        contentElements: [{
          sectionId: 5,
          typeName: 'withTestId',
          configuration: {testId: 10, position: 'full'}
        }]
      }
    });

    getContentElementByTestId(10).select();

    expect(getSectionByPermaId(6).hasBottomPadding()).toBe(true);
  });
});
