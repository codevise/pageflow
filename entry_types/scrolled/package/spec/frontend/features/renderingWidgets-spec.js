import React from 'react';

import {frontend} from 'frontend';

import {renderEntry, usePageObjects} from 'support/pageObjects';
import '@testing-library/jest-dom/extend-expect'

describe('rendering widgets', () => {
  usePageObjects();

  it('renders registered component of widget type', () => {
    frontend.widgetTypes.register('customNavigation', {
      component: function ({configuration}) {
        return (
          <div data-testid="test-component">{configuration.text}</div>
        )
      }
    });

    const {getByTestId} = renderEntry({
      seed: {
        widgets: [{
          typeName: 'customNavigation',
          role: 'header',
          configuration: {text: 'Some text'}
        }]
      }
    });

    expect(getByTestId('test-component')).toHaveTextContent('Some text');
  });
});
