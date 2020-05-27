import {createContext, useContext, useEffect} from 'react';

import {useContentElementAttributes} from './useContentElementAttributes';

export const ContentElementEditorCommandEmitterContext = createContext({
  on() {},
  off() {}
});

export function useContentElementEditorCommandSubscription(callback) {
  const {contentElementId} = useContentElementAttributes();
  const emitter = useContext(ContentElementEditorCommandEmitterContext);

  useEffect(() => {
    emitter.on(`command:${contentElementId}`, callback);

    return () => emitter.off(`command:${contentElementId}`, callback)
  }, [emitter, callback, contentElementId]);
}
