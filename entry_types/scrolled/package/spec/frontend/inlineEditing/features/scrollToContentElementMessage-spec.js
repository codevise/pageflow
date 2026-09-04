import {renderEntry, useInlineEditingPageObjects} from 'support/pageObjects/inlineEditing';

import {asyncHandlingOf} from 'support/asyncHandlingOf';

describe('scroll to content element message', () => {
  useInlineEditingPageObjects();

  beforeEach(() => {
    window.scrollTo = jest.fn();
    window.scrollY = 1000;
  });

  function render() {
    return renderEntry({
      seed: {
        contentElements: [
          {id: 5, typeName: 'withTestId', configuration: {testId: 1}},
          {id: 6, typeName: 'withTestId', configuration: {testId: 2}}
        ]
      }
    });
  }

  it('scrolls to the content element with the given id', async () => {
    const {fakeContentElementBoundingClientRectsByTestId} = render();

    fakeContentElementBoundingClientRectsByTestId({1: {top: 100}, 2: {top: 900}});

    await asyncHandlingOf(() => {
      window.postMessage({type: 'SCROLL_TO_CONTENT_ELEMENT', payload: {id: 6}}, '*');
    });

    expect(window.scrollTo).toHaveBeenCalledWith(expect.objectContaining({
      top: 900 + window.scrollY - window.innerHeight * 0.25
    }));
  });

  it('supports aligning the content element at the start of the viewport', async () => {
    const {fakeContentElementBoundingClientRectsByTestId} = render();

    fakeContentElementBoundingClientRectsByTestId({1: {top: 100}, 2: {top: 900}});

    await asyncHandlingOf(() => {
      window.postMessage(
        {type: 'SCROLL_TO_CONTENT_ELEMENT', payload: {id: 6, align: 'start'}}, '*'
      );
    });

    expect(window.scrollTo).toHaveBeenCalledWith(expect.objectContaining({
      top: 900 + window.scrollY
    }));
  });

  it('supports centering the content element in the viewport', async () => {
    const {fakeContentElementBoundingClientRectsByTestId} = render();

    fakeContentElementBoundingClientRectsByTestId({1: {top: 100, height: 200},
                                                   2: {top: 900, height: 200}});

    await asyncHandlingOf(() => {
      window.postMessage(
        {type: 'SCROLL_TO_CONTENT_ELEMENT', payload: {id: 6, align: 'center'}}, '*'
      );
    });

    expect(window.scrollTo).toHaveBeenCalledWith(expect.objectContaining({
      top: 900 + window.scrollY - (window.innerHeight - 200) / 2
    }));
  });

  it('skips scrolling to a content element in the viewport if requested', async () => {
    const {fakeContentElementBoundingClientRectsByTestId} = render();

    fakeContentElementBoundingClientRectsByTestId({1: {top: 100}, 2: {top: 900}});

    await asyncHandlingOf(() => {
      window.postMessage(
        {type: 'SCROLL_TO_CONTENT_ELEMENT', payload: {id: 5, ifNeeded: true}}, '*'
      );
    });

    expect(window.scrollTo).not.toHaveBeenCalled();
  });

  it('ignores unknown content elements', async () => {
    const {fakeContentElementBoundingClientRectsByTestId} = render();

    fakeContentElementBoundingClientRectsByTestId({1: {top: 100}, 2: {top: 900}});

    await asyncHandlingOf(() => {
      window.postMessage({type: 'SCROLL_TO_CONTENT_ELEMENT', payload: {id: 7}}, '*');
    });

    expect(window.scrollTo).not.toHaveBeenCalled();
  });
});
