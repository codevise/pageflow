import React, {useEffect} from 'react';

import Entry from 'frontend/Entry';
import {frontend, useContentElementConfigurationUpdate} from 'frontend';
import {loadInlineEditingComponents} from 'frontend/inlineEditing';

import {act, fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'
import {renderInEntry, fakeParentWindow, tick} from 'support';
import {simulateScrollingIntoView} from 'support/fakeIntersectionObserver';
import {useFakeTranslations} from 'pageflow/testHelpers';

import useScrollTarget from 'frontend/useScrollTarget';
jest.mock('frontend/useScrollTarget');

beforeAll(async () => {
  await loadInlineEditingComponents()
});

describe('Entry', () => {
  useFakeTranslations({
    'pageflow_scrolled.inline_editing.select_section': 'Select section',
    'pageflow_scrolled.inline_editing.select_content_element': 'Select content element',
    'pageflow_scrolled.inline_editing.insert_content_element.after': 'Insert content element after',
    'pageflow_scrolled.inline_editing.edit_section_settings': 'Edit section settings',
    'pageflow_scrolled.inline_editing.edit_section_transition_before': 'Edit section transition before',
    'pageflow_scrolled.inline_editing.edit_section_transition_after': 'Edit section transition after'
  });

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

  it('does not post SELECTED message on click when content element uses custom selection rect', () => {
    window.parent.postMessage = jest.fn();
    frontend.contentElementTypes.register('text', {
      component: function Component() {
        return 'Content element';
      },
      customSelectionRect: true
    });

    const {getByText} = renderInEntry(<Entry />, {
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

  it('posts SELECTED message when edit button on section selection rect is clicked', () => {
    window.parent.postMessage = jest.fn();
    frontend.contentElementTypes.register('text', {
      component: function Component() {
        return 'Content element';
      }
    });

    const {getByLabelText, getByTitle} = renderInEntry(<Entry />, {
      seed: {
        sections: [{id: 1}]
      }
    });

    fireEvent.click(getByLabelText('Select section'));
    fireEvent.mouseDown(getByTitle('Edit section settings'));

    expect(window.parent.postMessage).toHaveBeenCalledWith({
      type: 'SELECTED',
      payload: {id: 1, type: 'sectionSettings'}
    }, expect.anything());
  });

  it('posts SELECTED message when edit transition button before section selection rect is clicked', () => {
    window.parent.postMessage = jest.fn();
    frontend.contentElementTypes.register('text', {
      component: function Component() {
        return 'Content element';
      }
    });

    const {getAllByLabelText, getByTitle} = renderInEntry(<Entry />, {
      seed: {
        sections: [{id: 1}, {id: 2}]
      }
    });

    fireEvent.click(getAllByLabelText('Select section')[1]);
    fireEvent.mouseDown(getByTitle('Edit section transition before'));

    expect(window.parent.postMessage).toHaveBeenCalledWith({
      type: 'SELECTED',
      payload: {id: 2, type: 'sectionTransition'}
    }, expect.anything());
  });

  it('posts SELECTED message for next section ' +
     'when edit transition button after section selection rect is clicked', () => {
    window.parent.postMessage = jest.fn();
    frontend.contentElementTypes.register('text', {
      component: function Component() {
        return 'Content element';
      }
    });

    const {getAllByLabelText, getByTitle} = renderInEntry(<Entry />, {
      seed: {
        sections: [{id: 1}, {id: 2}]
      }
    });

    fireEvent.click(getAllByLabelText('Select section')[0]);
    fireEvent.mouseDown(getByTitle('Edit section transition after'));

    expect(window.parent.postMessage).toHaveBeenCalledWith({
      type: 'SELECTED',
      payload: {id: 2, type: 'sectionTransition'}
    }, expect.anything());
  });

  it('posts INSERT_CONTENT_ELEMENT message when selection rect insert button is clicked', () => {
    window.parent.postMessage = jest.fn();
    const {getByLabelText, getByTitle} = renderInEntry(<Entry />, {
      seed: {
        contentElements: [{id: 1}]
      }
    });

    fireEvent.click(getByLabelText('Select content element'));
    fireEvent.click(getByTitle('Insert content element after'));

    expect(window.parent.postMessage).toHaveBeenCalledWith({
      type: 'INSERT_CONTENT_ELEMENT',
      payload: {id: 1, at: 'after'}
    }, expect.anything());
  });
});
