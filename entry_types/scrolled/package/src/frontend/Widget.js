import React from 'react';

import {api} from './api';
import {useWidget} from '../entryState';

export function Widget({role}) {
  const widget = useWidget({role});

  if (!widget) {
    return null;
  }

  const Component = api.widgetTypes.getComponent(widget.typeName);

  return (
    <Component configuration={widget.configuration} />
  );
}
