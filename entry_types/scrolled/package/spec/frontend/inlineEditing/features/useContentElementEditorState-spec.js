import React, {useEffect} from 'react';
import {act, fireEvent} from '@testing-library/react';

import {frontend, useContentElementEditorState} from 'pageflow-scrolled/frontend';
import {useEditorSelection} from 'frontend/inlineEditing/EditorState';
import {renderEntry, useInlineEditingPageObjects} from 'support/pageObjects/inlineEditing';

import '@testing-library/jest-dom/extend-expect';

describe('inline editing useContentElementEditorState', () => {
  useInlineEditingPageObjects();

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

    const {getByTestId} = renderEntry({
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

  it('exposes type matching the active selection', () => {
    let captured = {};
    let setSelectionRef;

    function Test() {
      const state = useContentElementEditorState();
      const {select} = useEditorSelection();

      captured = state;
      useEffect(() => {
        setSelectionRef = select;
      }, [select]);

      return null;
    }

    renderEntry({
      contentElement: {ui: <Test />}
    });

    expect(captured.type).toBeNull();

    act(() => setSelectionRef({type: 'contentElement', id: 1}));
    expect(captured.type).toBe('contentElement');
    expect(captured.isSelected).toBe(true);

    act(() => setSelectionRef({type: 'contentElementComments', id: 1}));
    expect(captured.type).toBe('contentElementComments');
    expect(captured.isSelected).toBe(true);

    act(() => setSelectionRef({type: 'newThread', subjectType: 'ContentElement', subjectId: 10}));
    expect(captured.type).toBe('newThread');
    expect(captured.isSelected).toBe(true);
  });

  it('returns true for isEditable', () => {
    function Test() {
      const {isEditable} = useContentElementEditorState();

      return (
        <div data-testid="contentElement">
          {isEditable ? 'Edit me' : 'Read only'}
        </div>
      );
    }

    const {getByTestId} = renderEntry({
      contentElement: {ui: <Test />}
    });

    expect(getByTestId('contentElement')).toHaveTextContent('Edit me');
  });

  it('lets content elements publish transient state via post message', () => {

    function Test() {
      const {setTransientState} = useContentElementEditorState();

      useEffect(() => setTransientState({some: 'state'}));
      return null;
    }

    renderEntry({
      contentElement: {ui: <Test />}
    });

    expect(window.parent.postMessage).toHaveBeenCalledWith({
      type: 'UPDATE_TRANSIENT_CONTENT_ELEMENT_STATE',
      payload: {
        id: 1,
        state: {some: 'state'}
      }
    }, expect.anything());
  });

  it('does not send message if transient state is shallow equal to previous transient state', () => {

    function Test() {
      const {setTransientState} = useContentElementEditorState();

      useEffect(() => setTransientState({some: 'state'}));
      return null;
    }

    const {rerender} = renderEntry({
      contentElement: {ui: <Test />}
    });

    window.parent.postMessage.mockClear();
    rerender();

    expect(window.parent.postMessage).not.toHaveBeenCalled();
  });
});
