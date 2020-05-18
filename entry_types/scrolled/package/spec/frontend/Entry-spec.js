import React, {useEffect} from 'react';

import Entry from 'frontend/Entry';
import {frontend, useContentElementConfigurationUpdate} from 'frontend';
import {loadInlineEditingComponents} from 'frontend/inlineEditing';

import {act, fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'
import {renderInEntry, fakeParentWindow, tick} from 'support';
import {simulateScrollingIntoView} from 'support/fakeIntersectionObserver';

import useScrollTarget from 'frontend/useScrollTarget';
jest.mock('frontend/useScrollTarget');

beforeAll(async () => {
  await loadInlineEditingComponents()
});

describe('Entry', () => {
  it('posts CHANGE_SECTION message when section becomes active', () => {
    fakeParentWindow();
    window.parent.postMessage = jest.fn();

    const {container} = renderInEntry(<Entry />, {
      seed: {
        sections: [
          {permaId: 10},
          {permaId: 11}
        ]
      }
    });

    act(() =>
      simulateScrollingIntoView(container.querySelector('#section-11'))
    );

    expect(window.parent.postMessage).toHaveBeenCalledWith({
      type: 'CHANGE_SECTION',
      payload: {index: 1}
    }, expect.anything());
  });

  it('scrolls to scene passed via SCROLL_TO_SECTION message', async () => {
    fakeParentWindow();

    const {container} = renderInEntry(<Entry />, {
      seed: {
        sections: [
          {permaId: 10},
          {permaId: 11}
        ]
      }
    });

    await act(async () => {
      window.postMessage({type: 'SCROLL_TO_SECTION', payload: {index: 1}}, '*')
      await tick(); // Make sure async handling of message is wrapped in act
    });

    expect(useScrollTarget.lastTarget).toBe(container.querySelector('#section-11'));
  });

  it('renders registered components of content element type', () => {
    frontend.contentElementTypes.register('text', {
      component: function ({configuration}) {
        return (
          <div data-testid="test-component">{configuration.text}</div>
        )
      }
    });

    const {getByTestId} =  renderInEntry(<Entry />, {
      seed: {
        contentElements: [{
          typeName: 'text',
          configuration: {
            text: 'Some text'
          }
        }]
      }
    });

    expect(getByTestId('test-component')).toHaveTextContent('Some text');
  });

  it('lets content elements use hook to update their own configuration', () => {
    frontend.contentElementTypes.register('text', {
      component: function Component({configuration}) {
        const update = useContentElementConfigurationUpdate();

        useEffect(() => update({text: 'New text'}),
                  [update]);

        return (
          <div data-testid="test-component">{configuration.text}</div>
        )
      }
    });

    const {getByTestId} =  renderInEntry(<Entry />, {
      seed: {
        contentElements: [{
          typeName: 'text',
          configuration: {
            text: 'Some text'
          }
        }]
      }
    });

    expect(getByTestId('test-component')).toHaveTextContent('New text');
  });

  it('posts UPDATE_CONTENT_ELEMENT message when content element updates its configuration', () => {
    window.parent.postMessage = jest.fn();
    frontend.contentElementTypes.register('text', {
      component: function Component({configuration}) {
        const update = useContentElementConfigurationUpdate();

        useEffect(() => update({text: 'New text'}),
                  [update]);

        return null;
      }
    });

    renderInEntry(<Entry />, {
      seed: {
        contentElements: [{id: 1, typeName: 'text'}]
      }
    });

    expect(window.parent.postMessage).toHaveBeenCalledWith({
      type: 'UPDATE_CONTENT_ELEMENT',
      payload: {id: 1, configuration: {text: 'New text'}}
    }, expect.anything());
  });

  it('posts SELECTED message when conten element is clicked', () => {
    window.parent.postMessage = jest.fn();
    frontend.contentElementTypes.register('text', {
      component: function Component() {
        return 'Content element';
      }
    });

    const {getByText} = renderInEntry(<Entry />, {
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
});
