import {renderEntry, usePageObjects} from 'support/pageObjects';

import {contentElementWidths as widths} from 'pageflow-scrolled/frontend';

describe('content element margin', () => {
  usePageObjects();

  it('applies margin to content elements by default', () => {
    const {getContentElementByTestId} = renderEntry({
      seed: {
        sections: [{id: 5}],
        contentElements: [{sectionId: 5,
                           typeName: 'withTestId',
                           configuration: {testId: 1}}]
      }
    });

    expect(getContentElementByTestId(1).hasMargin()).toBe(true);
  });

  it('does not apply margin to full width content elements', () => {
    const {getContentElementByTestId} = renderEntry({
      seed: {
        sections: [{id: 5}],
        contentElements: [{sectionId: 5,
                           typeName: 'withTestId',
                           configuration: {testId: 1, width: widths.full}}]
      }
    });

    expect(getContentElementByTestId(1).hasMargin()).toBe(false);
  });
});
