import {useInlineEditingPageObjects, renderEntry} from 'support/pageObjects';
import {fakeParentWindow} from 'support';
import '@testing-library/jest-dom/extend-expect'

describe('MOVE_CONTENT_ELEMENT message', () => {
  useInlineEditingPageObjects();

  beforeEach(() => {
    fakeParentWindow()
    window.parent.postMessage = jest.fn();
  });

  it('is posted when content element is dragged before other content element', () => {
    const {getContentElementByTestId} = renderEntry({
      seed: {
        contentElements: [
          {
            id: 1,
            typeName: 'withTestId',
            configuration: {testId: 1}
          },
          {
            id: 2,
            typeName: 'withTestId',
            configuration: {testId: 2}
          }
        ]
      }
    });

    const contentElement = getContentElementByTestId(2);
    contentElement.select();
    const otherContentElement = getContentElementByTestId(1);
    contentElement.drag('before', otherContentElement);

    expect(window.parent.postMessage).toHaveBeenCalledWith({
      type: 'MOVE_CONTENT_ELEMENT',
      payload: expect.objectContaining({id: 2, to: {at: 'before', id: 1}})
    }, expect.anything());
  });

  it('is posted when content element is dragged after other content element', () => {
    const {getContentElementByTestId} = renderEntry({
      seed: {
        contentElements: [
          {
            id: 1,
            typeName: 'withTestId',
            configuration: {testId: 1}
          },
          {
            id: 2,
            typeName: 'withTestId',
            configuration: {testId: 2}
          }
        ]
      }
    });

    const contentElement = getContentElementByTestId(1);
    contentElement.select();
    const otherContentElement = getContentElementByTestId(2);
    contentElement.drag('after', otherContentElement);

    expect(window.parent.postMessage).toHaveBeenCalledWith({
      type: 'MOVE_CONTENT_ELEMENT',
      payload: expect.objectContaining({id: 1, to: {at: 'after', id: 2}})
    }, expect.anything());
  });
});
