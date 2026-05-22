import {renderEntry, useInlineEditingPageObjects} from 'support/pageObjects/inlineEditing';

import '@testing-library/jest-dom/extend-expect';

describe('inline editing forced section padding', () => {
  useInlineEditingPageObjects();

  it('forces padding below full width element if section is selected', () => {
    const {getSectionByPermaId} = renderEntry({
      seed: {
        sections: [{id: 5, permaId: 6}],
        contentElements: [{sectionId: 5, configuration: {width: 3}}]
      }
    });

    const section = getSectionByPermaId(6);
    section.select();

    expect(section.hasForcedPadding()).toBe(true);
  });

  it('forces padding below full width element if element is selected', () => {
    const {getSectionByPermaId, getContentElementByTestId} = renderEntry({
      seed: {
        sections: [{id: 5, permaId: 6}],
        contentElements: [{
          sectionId: 5,
          typeName: 'withTestId',
          configuration: {testId: 10, width: 3}
        }]
      }
    });

    getContentElementByTestId(10).select();

    expect(getSectionByPermaId(6).hasForcedPadding()).toBe(true);
  });

  it('does not force padding if padding is selected', () => {
    const {getSectionByPermaId} = renderEntry({
      seed: {
        sections: [{id: 5, permaId: 6}],
        contentElements: [{sectionId: 5, configuration: {width: 3}}]
      }
    });

    const section = getSectionByPermaId(6);
    section.selectPadding('bottom');

    expect(section.hasForcedPadding()).toBe(false);
  });
});
