import {useInlineEditingPageObjects, renderEntry} from 'support/pageObjects';
import {fakeParentWindow} from 'support';
import '@testing-library/jest-dom/extend-expect'

describe('INSERT_CONTENT_ELEMENT message', () => {
  useInlineEditingPageObjects();

  beforeEach(() => {
    fakeParentWindow()
    window.parent.postMessage = jest.fn();
  });

  it('is posted when selection rect insert button is clicked', () => {
    const {getContentElementByTestId} = renderEntry({
      seed: {
        contentElements: [
          {
            typeName: 'withTestId',
            configuration: {testId: 5}
          }
        ]
      }
    });

    const contentElement = getContentElementByTestId(5);
    contentElement.select();
    contentElement.clickInsertAfterButton();

    expect(window.parent.postMessage).toHaveBeenCalledWith({
      type: 'INSERT_CONTENT_ELEMENT',
      payload: {id: 1, at: 'after'}
    }, expect.anything());
  });

  it('is posted when section insert button is clicked', () => {
    const {getSectionByPermaId} = renderEntry({
      seed: {
        sections: [{id: 1, permaId: 11}]
      }
    });

    getSectionByPermaId(11).select();
    getSectionByPermaId(11).clickAddContentElement();

    expect(window.parent.postMessage).toHaveBeenCalledWith({
      type: 'INSERT_CONTENT_ELEMENT',
      payload: {id: 1, at: 'endOfSection'}
    }, expect.anything());
  });
});
