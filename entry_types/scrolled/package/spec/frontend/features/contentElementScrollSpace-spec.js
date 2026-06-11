import {renderEntry, usePageObjects} from 'support/pageObjects';
import {useContentElementLayoutMatchers} from 'support/matchers';

describe('content element scroll space', () => {
  usePageObjects();
  useContentElementLayoutMatchers();

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

    expect(getContentElementByTestId(1)).not.toHaveScrollSpace();
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

    expect(getContentElementByTestId(1)).toHaveScrollSpace();
  });
});
