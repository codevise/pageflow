import React from 'react';

import {Widget} from 'frontend/Widget';
import {api} from 'frontend/api';

import {renderInEntry} from 'support';
import '@testing-library/jest-dom/extend-expect'

describe('Widget', () => {
  it('can have children', () => {
    api.widgetTypes.register('customBox', {
      component: function ({children}) {
        return (
          <div data-testid="test-component">{children}</div>
        )
      }
    });

    const {getByTestId} = renderInEntry(
      <Widget role="box">
        Some text
      </Widget>,
      {
        seed: {
          widgets: [{
            typeName: 'customBox',
            role: 'box',
          }]
        }
      }
    );

    expect(getByTestId('test-component')).toHaveTextContent('Some text');
  });
});
