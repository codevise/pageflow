import React from 'react';

import {frontend} from 'frontend';

import {renderEntry, usePageObjects} from 'support/pageObjects';
import '@testing-library/jest-dom/extend-expect'

describe('rendering content elements', () => {
  usePageObjects();

  it('renders registered components of content element type', () => {
    frontend.contentElementTypes.register('text', {
      component: function ({configuration}) {
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

    expect(getByTestId('test-component')).toHaveTextContent('Some text');
  });
});
