import React, {useEffect} from 'react';

import {frontend} from 'frontend';

import {renderEntry, usePageObjects} from 'support/pageObjects';
import '@testing-library/jest-dom/extend-expect'

describe('content element errors', () => {
  usePageObjects();

  it('are handled at content element level', () => {
    frontend.contentElementTypes.register('working', {
      component: function Working({configuration}) {
        return (
          <div>Working component</div>
        )
      }
    });
    frontend.contentElementTypes.register('broken', {
      component: function Broken({configuration}) {
        useEffect(() => { throw(new Error('Something went wrong')); });

        return (
          <div>I'll throw an error</div>
        )
      }
    });

    jest.spyOn(console, 'error').mockImplementation(() => {});
    const {queryByText} = renderEntry({
      seed: {
        contentElements: [
          {typeName: 'working'},
          {typeName: 'broken'}
        ]
      }
    });

    expect(queryByText('Working component')).toBeInTheDocument();
    expect(queryByText('Error rendering element of type "broken"')).toBeInTheDocument();
  });
});
