import React, {useContext} from 'react';

export const WidgetConfigurationUpdateContext = React.createContext(() => {});

export function useWidgetConfigurationUpdate() {
  return useContext(WidgetConfigurationUpdateContext);
}
