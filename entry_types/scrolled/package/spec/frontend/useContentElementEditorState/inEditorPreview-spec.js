import {frontend, Entry, useContentElementEditorState} from 'pageflow-scrolled/frontend';
import {renderInEntry} from 'support';

import React from 'react';
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
});
