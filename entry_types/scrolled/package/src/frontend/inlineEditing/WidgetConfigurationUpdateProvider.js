import React, {useCallback} from 'react';

import {WidgetConfigurationUpdateContext} from '../useWidgetConfigurationUpdate';
import {updateWidgetConfiguration, useEntryStateDispatch} from '../../entryState';
import {postUpdateWidgetMessage} from './postMessage';

export function WidgetConfigurationUpdateProvider({role, children}) {
  const dispatch = useEntryStateDispatch();
  const update = useCallback(
    configuration => {
      postUpdateWidgetMessage({role, configuration});
      updateWidgetConfiguration({
        dispatch,
        role,
        configuration
      });
    },
    [dispatch, role]
  );

  return (
    <WidgetConfigurationUpdateContext.Provider value={update}>
      {children}
    </WidgetConfigurationUpdateContext.Provider>
  );
}
