import React from 'react';

import {Widget} from 'frontend/Widget';
import {api} from 'frontend/api';

import {renderInEntry} from 'support';
import '@testing-library/jest-dom/extend-expect'

describe('Widget', () => {
  it('renders nothing when no widget is configured for role', () => {
    const {container} = renderInEntry(
      <Widget role="nonexistent" />,
      {
        seed: {
          widgets: []
        }
      }
    );

    expect(container.firstChild).toBeNull();
  });

  it('renders fallback when no widget is configured and renderFallback is provided', () => {
    const {getByTestId} = renderInEntry(
      <Widget role="nonexistent"
              props={{someProp: 'content'}}
              renderFallback={({someProp, children}) =>
                <div data-testid="fallback">Fallback {someProp} {children}</div>
              }>
        some children
      </Widget>,
      {
        seed: {
          widgets: []
        }
      }
    );

    expect(getByTestId('fallback')).toHaveTextContent('Fallback content some children');
  });

  it('renders widget instead of fallback when both are present', () => {
    api.widgetTypes.register('testWidget', {
      component: function () {
        return <div data-testid="widget">Widget content</div>
      }
    });

    const {getByTestId, queryByTestId} = renderInEntry(
      <Widget role="test" renderFallback={({children}) => <div data-testid="fallback">Fallback content</div>} />,
      {
        seed: {
          widgets: [{
            typeName: 'testWidget',
            role: 'test',
          }]
        }
      }
    );

    expect(getByTestId('widget')).toHaveTextContent('Widget content');
    expect(queryByTestId('fallback')).toBeNull();
  });

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
