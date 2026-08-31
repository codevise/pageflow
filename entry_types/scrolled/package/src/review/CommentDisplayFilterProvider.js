import React, {createContext, useCallback, useContext, useMemo, useState} from 'react';

const noop = () => {};

const CommentDisplayFilterContext = createContext({
  resolution: 'unresolved',
  alwaysShowComments: true,
  setResolution: noop
});

export function CommentDisplayFilterProvider({
  resolution = 'unresolved', alwaysShowComments = true, setResolution = noop, children
}) {
  const value = useMemo(
    () => ({resolution, alwaysShowComments, setResolution}),
    [resolution, alwaysShowComments, setResolution]
  );

  return (
    <CommentDisplayFilterContext.Provider value={value}>
      {children}
    </CommentDisplayFilterContext.Provider>
  );
}

export function useCommentDisplayFilter() {
  return useContext(CommentDisplayFilterContext);
}

export function useStoredCommentDisplayFilter(storageKey) {
  const [resolution, setResolution] = useState(() => readResolution(storageKey));

  const store = useCallback(resolution => {
    setResolution(resolution);
    storeResolution(storageKey, resolution);
  }, [storageKey]);

  return useMemo(() => ({resolution, setResolution: store}), [resolution, store]);
}

function readResolution(storageKey) {
  return getLocalStorage()?.[storageKey] === 'all' ? 'all' : 'unresolved';
}

function storeResolution(storageKey, resolution) {
  const storage = getLocalStorage();

  if (storage) {
    storage[storageKey] = resolution;
  }
}

function getLocalStorage() {
  try {
    return typeof window === 'undefined' ? null : window.localStorage;
  }
  catch(e) {
    // Safari throws SecurityError when accessing window.localStorage
    // if cookies/website data are disabled.
    return null;
  }
}
