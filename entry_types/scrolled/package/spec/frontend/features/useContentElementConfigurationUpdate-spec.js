import React, {useEffect} from 'react';

import {frontend, useContentElementConfigurationUpdate} from 'frontend';

import {renderEntry, useInlineEditingPageObjects} from 'support/pageObjects';
import {fakeParentWindow} from 'support';
import '@testing-library/jest-dom/extend-expect'

describe('useContentElementConfigurationUpdate', () => {
  useInlineEditingPageObjects();

  beforeEach(() => {
    fakeParentWindow()
    window.parent.postMessage = jest.fn();
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

    const {getByTestId} = renderEntry({
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
    frontend.contentElementTypes.register('text', {
      component: function Component({configuration}) {
        const update = useContentElementConfigurationUpdate();

        useEffect(() => update({text: 'New text'}),
                  [update]);

        return null;
      }
    });

    renderEntry({
      seed: {
        contentElements: [{id: 1, typeName: 'text'}]
      }
    });

    expect(window.parent.postMessage).toHaveBeenCalledWith({
      type: 'UPDATE_CONTENT_ELEMENT',
      payload: {id: 1, configuration: {text: 'New text'}}
    }, expect.anything());
  });
});
