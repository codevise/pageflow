import {frontend, Entry, useContentElementEditorState} from 'pageflow-scrolled/frontend';
import {renderInEntry} from 'support';

import React, {useEffect} from 'react';
import {fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'

describe('useContentElementEditorState in frontend', () => {
  it('returns false for isSelected', () => {
    frontend.contentElementTypes.register('test', {
      component: function Test({configuration}) {
        const {isSelected} = useContentElementEditorState();

        return (
          <div data-testid="contentElement">
            {isSelected ? 'Selected' : 'Unselected'}
          </div>
        );
      }
    });

    const {getByTestId} =  renderInEntry(<Entry />, {
      seed: {
        contentElements: [{typeName: 'test'}]
      }
    });
    fireEvent.click(getByTestId('contentElement'));

    expect(getByTestId('contentElement')).toHaveTextContent('Unselected');
  });

  it('returns false for isEditable', () => {
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

    expect(getByTestId('contentElement')).toHaveTextContent('Read only');
  });

  it('provides noop setTransientState function', () => {
    frontend.contentElementTypes.register('test', {
      component: function Test({configuration}) {
        const {setTransientState} = useContentElementEditorState();

        useEffect(() => setTransientState({some: 'state'}));
        return null;
      }
    });

    expect(() =>
      renderInEntry(<Entry />, {
        seed: {
          contentElements: [
            {typeName: 'test'}
          ]
        }
      })
    ).not.toThrow();
  });
});
