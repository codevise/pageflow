import React, {useEffect} from 'react';
import {fireEvent} from '@testing-library/react';

import {useContentElementEditorState} from 'pageflow-scrolled/frontend';
import {renderEntry, usePageObjects} from 'support/pageObjects';

import '@testing-library/jest-dom/extend-expect';

describe('useContentElementEditorState', () => {
  usePageObjects();

  it('returns false for isSelected', () => {
    function Test() {
      const {isSelected} = useContentElementEditorState();

      return (
        <div data-testid="contentElement">
          {isSelected ? 'Selected' : 'Unselected'}
        </div>
      );
    }

    const {getByTestId} = renderEntry({
      contentElement: {ui: <Test />}
    });
    fireEvent.click(getByTestId('contentElement'));

    expect(getByTestId('contentElement')).toHaveTextContent('Unselected');
  });

  it('returns false for isEditable', () => {
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

    expect(getByTestId('contentElement')).toHaveTextContent('Read only');
  });

  it('provides noop setTransientState function', () => {
    function Test() {
      const {setTransientState} = useContentElementEditorState();

      useEffect(() => setTransientState({some: 'state'}));
      return null;
    }

    expect(() =>
      renderEntry({
        contentElement: {ui: <Test />}
      })
    ).not.toThrow();
  });
});
