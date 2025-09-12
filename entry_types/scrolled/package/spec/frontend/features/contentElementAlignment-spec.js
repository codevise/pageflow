import {renderEntry, usePageObjects} from 'support/pageObjects';
import '@testing-library/jest-dom/extend-expect';

describe('content element alignment', () => {
  usePageObjects();

  it('applies alignment class for narrow inline element', () => {
    const {getContentElementByTestId} = renderEntry({
      seed: {
        sections: [{id: 1, permaId: 10, configuration: {layout: 'center'}}],
        contentElements: [{
          id: 1,
          permaId: 100,
          sectionId: 1,
          typeName: 'withTestId',
          configuration: {alignment: 'right', width: -1, testId: 'probe'}
        }]
      }
    });

    const contentElement = getContentElementByTestId('probe');
    expect(contentElement.hasAlignment('right')).toBe(true);
  });

  it('applies alignment class for narrow standAlone element', () => {
    const {getContentElementByTestId} = renderEntry({
      seed: {
        sections: [{id: 1, permaId: 10, configuration: {layout: 'center'}}],
        contentElements: [{
          id: 1,
          permaId: 100,
          sectionId: 1,
          typeName: 'withTestId',
          configuration: {
            position: 'standAlone',
            alignment: 'right',
            width: -1,
            testId: 'probe'
          }
        }]
      }
    });

    const contentElement = getContentElementByTestId('probe');
    expect(contentElement.hasAlignment('right')).toBe(true);
  });

  it('ignores alignment class when width changes', () => {
    const {getContentElementByTestId} = renderEntry({
      seed: {
        sections: [{id: 1, permaId: 10, configuration: {layout: 'left'}}],
        contentElements: [{
          id: 1,
          permaId: 100,
          sectionId: 1,
          typeName: 'withTestId',
          configuration: {alignment: 'left', width: 1, testId: 'probe'}
        }]
      }
    });

    const contentElement = getContentElementByTestId('probe');
    expect(contentElement.hasAlignment('left')).toBe(false);
  });
});
