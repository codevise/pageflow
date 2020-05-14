import React, {useCallback} from 'react';

import {ContentElementConfigurationUpdateContext} from '../useContentElementConfigurationUpdate';
import {updateContentElementConfiguration, useEntryStateDispatch} from '../../entryState';
import {postUpdateContentElementMessage} from './postMessage';

export function ContentElementConfigurationUpdateProvider({id, permaId, children}) {
  const dispatch = useEntryStateDispatch();
  const update = useCallback(
    configuration => {
      postUpdateContentElementMessage({id, configuration});
      updateContentElementConfiguration({
        dispatch,
        permaId,
        configuration
      });
    },
    [dispatch, permaId, id]
  );

  return (
    <ContentElementConfigurationUpdateContext.Provider value={update}>
      {children}
    </ContentElementConfigurationUpdateContext.Provider>
  );
}
