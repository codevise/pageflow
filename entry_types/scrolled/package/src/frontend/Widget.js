import React from 'react';

import {api} from './api';
import {useWidget} from '../entryState';

export function Widget({role, props, children, renderFallback}) {
  const widget = useWidget({role});

  if (!widget) {
    return renderFallback ? renderFallback({...props, children}) : null;
  }

  const Component = api.widgetTypes.getComponent(widget.typeName);

  return (
    <Component configuration={widget.configuration} {...props} children={children} />
  );
}
