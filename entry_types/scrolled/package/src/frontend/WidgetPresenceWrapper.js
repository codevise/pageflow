import React from 'react';
import {useActiveWidgets} from '../entryState';
import {api} from './api';

export function WidgetPresenceWrapper({children}) {
  const widgets = useActiveWidgets();

  return (
    <PresenceProviders widgets={widgets}>
      {children}
    </PresenceProviders>
  );
}

function PresenceProviders({widgets, children}) {
  if (widgets.length === 0) {
    return children;
  }

  const [first, ...rest] = widgets;
  const Provider = api.widgetTypes.getPresenceProvider(first.typeName);

  if (Provider) {
    return (
      <Provider configuration={first.configuration}>
        <PresenceProviders widgets={rest}>
          {children}
        </PresenceProviders>
      </Provider>
    );
  }

  return (
    <PresenceProviders widgets={rest}>
      {children}
    </PresenceProviders>
  );
}
