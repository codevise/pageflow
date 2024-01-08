import {renderEntry, usePageObjects} from 'support/pageObjects';

describe('content element scroll space', () => {
  usePageObjects();

  it('does not apply scroll space to elements by default', () => {
    const {getContentElementByTestId} = renderEntry({
      seed: {
        contentElements: [{
          typeName: 'withTestId',
          configuration: {
            testId: 1
          }
        }]
      }
    });

    expect(getContentElementByTestId(1).hasScrollSpace()).toBe(false);
  });

  it('applies scroll space to elements with stand alone position', () => {
    const {getContentElementByTestId} = renderEntry({
      seed: {
        contentElements: [{
          typeName: 'withTestId',
          configuration: {
            testId: 1,
            position: 'standAlone'
          }
        }]
      }
    });

    expect(getContentElementByTestId(1).hasScrollSpace()).toBe(true);
  });
});
