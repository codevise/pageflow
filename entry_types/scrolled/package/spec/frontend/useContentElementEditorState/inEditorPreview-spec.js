import {frontend, Entry, useContentElementEditorState} from 'pageflow-scrolled/frontend';
import {renderInEntry} from 'support';

import React, {useEffect} from 'react';
import {fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'

import {loadInlineEditingComponents} from 'frontend/inlineEditing';

describe('useContentElementEditorState in editor preview', () => {
  beforeAll(loadInlineEditingComponents);

  it('lets content elements determine whether they are selected', () => {
    frontend.contentElementTypes.register('test', {
      component: function Test({configuration}) {
        const {isSelected} = useContentElementEditorState();

        return (
          <div data-testid={configuration.testId}>
            {isSelected ? 'Selected' : 'Unselected'}
          </div>
        );
      }
    });

    const {getByTestId} =  renderInEntry(<Entry />, {
      seed: {
        contentElements: [
          {id: 1, typeName: 'test', configuration: {testId: 'one'}},
          {id: 2, typeName: 'test', configuration: {testId: 'two'}}
        ]
      }
    });
    fireEvent.click(getByTestId('two'));

    expect(getByTestId('one')).toHaveTextContent('Unselected');
    expect(getByTestId('two')).toHaveTextContent('Selected');
  });

  it('returns true for isEditable', () => {
    frontend.contentElementTypes.register('test', {
      component: function Test({configuration}) {
        const {isEditable} = useContentElementEditorState();

        return (
          <div data-testid="contentElement">
            {isEditable ? 'Edit me' : 'Read only'}
          </div>
        );
      }
    });

    const {getByTestId} =  renderInEntry(<Entry />, {
      seed: {
        contentElements: [{typeName: 'test'}]
      }
    });

    expect(getByTestId('contentElement')).toHaveTextContent('Edit me');
  });

  it('lets content elements publish transient state via post message', () => {
    window.parent.postMessage = jest.fn();
    frontend.contentElementTypes.register('test', {
      component: function Test() {
        const {setTransientState} = useContentElementEditorState();

        useEffect(() => setTransientState({some: 'state'}));
        return null;
      }
    });

    renderInEntry(<Entry />, {
      seed: {
        contentElements: [
          {id: 5, typeName: 'test'}
        ]
      }
    });

    expect(window.postMessage).toHaveBeenCalledWith({
      type: 'UPDATE_TRANSIENT_CONTENT_ELEMENT_STATE',
      payload: {
        id: 5,
        state: {some: 'state'}
      }
    }, expect.anything());
  });

  it('does not send message if transient state is shallow equal to previous transient state', () => {
    window.parent.postMessage = jest.fn();
    frontend.contentElementTypes.register('test', {
      component: function Test() {
        const {setTransientState} = useContentElementEditorState();

        useEffect(() => setTransientState({some: 'state'}));
        return null;
      }
    });

    const {rerender} = renderInEntry(<Entry />, {
      seed: {
        contentElements: [
          {id: 5, typeName: 'test'}
        ]
      }
    });

    rerender(<Entry />);

    expect(window.postMessage).toHaveBeenCalledTimes(1);
  });
});
