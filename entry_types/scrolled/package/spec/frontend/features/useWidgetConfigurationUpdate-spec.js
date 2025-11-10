import React, {useEffect} from 'react';

import {frontend, useWidgetConfigurationUpdate} from 'frontend';

import {renderEntry, useInlineEditingPageObjects} from 'support/pageObjects';
import {fakeParentWindow} from 'support';
import '@testing-library/jest-dom/extend-expect'

describe('useWidgetConfigurationUpdate', () => {
  useInlineEditingPageObjects();

  beforeEach(() => {
    fakeParentWindow()
    window.parent.postMessage = jest.fn();
  });

  it('lets widgets use hook to update their own configuration', () => {
    frontend.widgetTypes.register('customNavigation', {
      component: function Component({configuration}) {
        const update = useWidgetConfigurationUpdate();

        useEffect(() => update({text: 'New text'}),
                  [update]);

        return (
          <div data-testid="test-widget">{configuration.text}</div>
        )
      }
    });

    const {getByTestId} = renderEntry({
      seed: {
        widgets: [{
          role: 'header',
          typeName: 'customNavigation',
          configuration: {
            text: 'Some text'
          }
        }]
      }
    });

    expect(getByTestId('test-widget')).toHaveTextContent('New text');
  });

  it('does not change other configuration attributes', () => {
    frontend.widgetTypes.register('customNavigation', {
      component: function Component({configuration}) {
        const update = useWidgetConfigurationUpdate();

        useEffect(() => update({text: 'New text'}),
                  [update]);

        return (
          <div data-testid="test-widget">{configuration.other}</div>
        )
      }
    });

    const {getByTestId} = renderEntry({
      seed: {
        widgets: [{
          role: 'header',
          typeName: 'customNavigation',
          configuration: {
            text: 'Some text',
            other: 'Unchanged'
          }
        }]
      }
    });

    expect(getByTestId('test-widget')).toHaveTextContent('Unchanged');
  });

  it('posts UPDATE_WIDGET message when widget updates its configuration', () => {
    frontend.widgetTypes.register('customNavigation', {
      component: function Component({configuration}) {
        const update = useWidgetConfigurationUpdate();

        useEffect(() => update({text: 'New text'}),
                  [update]);

        return null;
      }
    });

    renderEntry({
      seed: {
        widgets: [{
          role: 'header',
          typeName: 'customNavigation'
        }]
      }
    });

    expect(window.parent.postMessage).toHaveBeenCalledWith({
      type: 'UPDATE_WIDGET',
      payload: {role: 'header', configuration: {text: 'New text'}}
    }, expect.anything());
  });
});
