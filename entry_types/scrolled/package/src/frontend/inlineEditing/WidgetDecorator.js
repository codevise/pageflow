import React from 'react';

import {WidgetConfigurationUpdateProvider} from './WidgetConfigurationUpdateProvider';

export function WidgetDecorator(props) {
  return (
    <WidgetConfigurationUpdateProvider role={props.role}>
      {props.children}
    </WidgetConfigurationUpdateProvider>
  );
}
