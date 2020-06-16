import {frontend} from 'frontend';

import {useInlineEditingPageObjects, renderEntry} from 'support/pageObjects';
import {fakeParentWindow} from 'support';
import {fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'

describe('SELECTED message', () => {
  useInlineEditingPageObjects();

  beforeEach(() => {
    fakeParentWindow()
    window.parent.postMessage = jest.fn();
  });

  it('is posted when content element is clicked', () => {
    frontend.contentElementTypes.register('text', {
      component: function Component() {
        return 'Content element';
      }
    });

    const {getByText} = renderEntry({
      seed: {
        contentElements: [{id: 1, typeName: 'text'}]
      }
    });

    fireEvent.click(getByText('Content element'));

    expect(window.parent.postMessage).toHaveBeenCalledWith({
      type: 'SELECTED',
      payload: {id: 1, type: 'contentElement'}
    }, expect.anything());
  });

  it('is not posted on click when content element uses custom selection rect', () => {
    frontend.contentElementTypes.register('text', {
      component: function Component() {
        return 'Content element';
      },
      customSelectionRect: true
    });

    const {getByText} = renderEntry({
      seed: {
        contentElements: [{id: 1, typeName: 'text'}]
      }
    });

    fireEvent.click(getByText('Content element'));

    expect(window.parent.postMessage).not.toHaveBeenCalledWith({
      type: 'SELECTED',
      payload: {id: 1, type: 'contentElement'}
    }, expect.anything());
  });

  it('is posted when edit button on section selection rect is clicked', () => {
    frontend.contentElementTypes.register('text', {
      component: function Component() {
        return 'Content element';
      }
    });

    const {getSectionByPermaId} = renderEntry({
      seed: {
        sections: [{id: 1, permaId: 10}]
      }
    });

    getSectionByPermaId(10).select();
    getSectionByPermaId(10).clickEditSettings();

    expect(window.parent.postMessage).toHaveBeenCalledWith({
      type: 'SELECTED',
      payload: {id: 1, type: 'sectionSettings'}
    }, expect.anything());
  });

  it('is posted when edit transition button before section selection rect is clicked', () => {
    frontend.contentElementTypes.register('text', {
      component: function Component() {
        return 'Content element';
      }
    });

    const {getSectionByPermaId} = renderEntry({
      seed: {
        sections: [{id: 1}, {id: 2, permaId: 20}]
      }
    });

    getSectionByPermaId(20).select();
    getSectionByPermaId(20).clickEditTransitionBefore();

    expect(window.parent.postMessage).toHaveBeenCalledWith({
      type: 'SELECTED',
      payload: {id: 2, type: 'sectionTransition'}
    }, expect.anything());
  });

  it('is posted for next section ' +
     'when edit transition button after section selection rect is clicked', () => {
    frontend.contentElementTypes.register('text', {
      component: function Component() {
        return 'Content element';
      }
    });

    const {getSectionByPermaId} = renderEntry({
      seed: {
        sections: [{id: 1, permaId: 10}, {id: 2}]
      }
    });

    getSectionByPermaId(10).select();
    getSectionByPermaId(10).clickEditTransitionAfter();

    expect(window.parent.postMessage).toHaveBeenCalledWith({
      type: 'SELECTED',
      payload: {id: 2, type: 'sectionTransition'}
    }, expect.anything());
  });
});
