import React, {useEffect} from 'react';

import {frontend} from 'frontend';

import {renderEntry, usePageObjects} from 'support/pageObjects';
import '@testing-library/jest-dom/extend-expect'

describe('content element width', () => {
  usePageObjects();

  it('is passed as resolved value', () => {
    frontend.contentElementTypes.register('test', {
      component: function Component({contentElementWidth}) {
        return (
          <div data-testid="test-component">{contentElementWidth}</div>
        )
      }
    });

    const {getByTestId} = renderEntry({
      seed: {
        contentElements: [{
          typeName: 'test',
          configuration: {
            width: 3,
            position: 'sticky'
          }
        }]
      }
    });

    expect(getByTestId('test-component')).toHaveTextContent(2);
  });
});
