import React, {useContext, createContext} from 'react';

import {frontend} from 'frontend';

import {renderEntry, usePageObjects} from 'support/pageObjects';
import '@testing-library/jest-dom/extend-expect'

describe('widget PresenceProvider', () => {
  usePageObjects();

  it('wraps entry content with PresenceProvider component', () => {
    frontend.widgetTypes.register('providerWidget', {
      component: function() { return <div>Widget</div>; },
      presenceProvider: function({children}) {
        return <div data-testid="presence-wrapper">{children}</div>;
      }
    });

    const {getByTestId} = renderEntry({
      seed: {
        widgets: [{
          typeName: 'providerWidget',
          role: 'header'
        }]
      }
    });

    expect(getByTestId('presence-wrapper')).toBeInTheDocument();
  });

  it('does not render PresenceProvider when widget is not active', () => {
    frontend.widgetTypes.register('providerWidget2', {
      component: function() { return <div>Widget</div>; },
      presenceProvider: function({children}) {
        return <div data-testid="presence-wrapper-2">{children}</div>;
      }
    });

    const {queryByTestId} = renderEntry({
      seed: {
        widgets: []
      }
    });

    expect(queryByTestId('presence-wrapper-2')).not.toBeInTheDocument();
  });

  it('passes configuration to PresenceProvider', () => {
    frontend.widgetTypes.register('configuredProviderWidget', {
      component: function() { return <div>Widget</div>; },
      presenceProvider: function({configuration, children}) {
        return (
          <div data-testid="configured-wrapper" data-fixed={String(configuration.fixed)}>
            {children}
          </div>
        );
      }
    });

    const {getByTestId} = renderEntry({
      seed: {
        widgets: [{
          typeName: 'configuredProviderWidget',
          role: 'header',
          configuration: {fixed: true}
        }]
      }
    });

    expect(getByTestId('configured-wrapper')).toHaveAttribute('data-fixed', 'true');
  });

  it('nests multiple PresenceProviders when multiple widgets are active', () => {
    frontend.widgetTypes.register('headerProviderWidget', {
      component: function() { return <div>Header</div>; },
      presenceProvider: function({children}) {
        return <div data-testid="header-wrapper">{children}</div>;
      }
    });

    frontend.widgetTypes.register('footerProviderWidget', {
      component: function() { return <div>Footer</div>; },
      presenceProvider: function({children}) {
        return <div data-testid="footer-wrapper">{children}</div>;
      }
    });

    const {getByTestId} = renderEntry({
      seed: {
        widgets: [
          {typeName: 'headerProviderWidget', role: 'header'},
          {typeName: 'footerProviderWidget', role: 'footer'}
        ]
      }
    });

    expect(getByTestId('header-wrapper')).toBeInTheDocument();
    expect(getByTestId('footer-wrapper')).toBeInTheDocument();
  });

  it('allows PresenceProvider to provide context consumed by widget component', () => {
    const TestContext = createContext(null);

    frontend.widgetTypes.register('contextProviderWidget', {
      component: function Component() {
        const value = useContext(TestContext);
        return <div data-testid="context-consumer">{value}</div>;
      },
      presenceProvider: function({children}) {
        return (
          <TestContext.Provider value="from-presence">
            {children}
          </TestContext.Provider>
        );
      }
    });

    const {getByTestId} = renderEntry({
      seed: {
        widgets: [{
          typeName: 'contextProviderWidget',
          role: 'header'
        }]
      }
    });

    expect(getByTestId('context-consumer')).toHaveTextContent('from-presence');
  });

  it('does not fail when widget type has no PresenceProvider', () => {
    frontend.widgetTypes.register('noProviderWidget', {
      component: function() { return <div data-testid="no-provider">Simple</div>; }
    });

    const {getByTestId} = renderEntry({
      seed: {
        widgets: [{typeName: 'noProviderWidget', role: 'header'}]
      }
    });

    expect(getByTestId('no-provider')).toBeInTheDocument();
  });
});
