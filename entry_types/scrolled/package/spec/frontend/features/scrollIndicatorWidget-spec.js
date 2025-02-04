import React from 'react';

import {renderEntry, usePageObjects} from 'support/pageObjects';

import {frontend} from 'frontend';

describe('scroll indicator widget', () => {
  usePageObjects();

  it('is rendered once', () => {
    frontend.widgetTypes.register('testScrollIndicator', {
      component: function ({children}) {
        return (
          <div data-testid="scrollIndicator">Scroll Indicator</div>
        )
      }
    });

    const {getByTestId} = renderEntry({
      seed: {
        sections: [{id: 5}, {id: 6}],
        widgets: [{
          typeName: 'testScrollIndicator',
          role:'scrollIndicator'
        }]
      }
    });

    expect(getByTestId('scrollIndicator')).not.toBeNull();
  });
});
