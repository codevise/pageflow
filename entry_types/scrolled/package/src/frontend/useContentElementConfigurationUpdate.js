import React, {useContext} from 'react';

export const ContentElementConfigurationUpdateContext = React.createContext(() => {});

export function useContentElementConfigurationUpdate() {
  return useContext(ContentElementConfigurationUpdateContext);
}
