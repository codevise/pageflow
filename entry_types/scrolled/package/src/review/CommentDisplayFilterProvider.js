import React, {createContext, useCallback, useContext, useMemo, useState} from 'react';

const noop = () => {};

const CommentDisplayFilterContext = createContext({
  resolution: 'unresolved',
  setResolution: noop
});

// Which resolutions of a thread the reviewer wants to see. The editor and
// the preview each run their own filter: the preview drives it from the
// toolbar via `useStoredCommentDisplayFilter`, while the editor's preview
// iframe is handed the resolution its sidebar menu holds.
export function CommentDisplayFilterProvider({
  resolution = 'unresolved', setResolution = noop, children
}) {
  const value = useMemo(() => ({resolution, setResolution}), [resolution, setResolution]);

  return (
    <CommentDisplayFilterContext.Provider value={value}>
      {children}
    </CommentDisplayFilterContext.Provider>
  );
}

export function useCommentDisplayFilter() {
  return useContext(CommentDisplayFilterContext);
}

// Keeps the resolution in local storage under the given key, so that the
// editor and the preview remember what they were last set to without
// inheriting each other's setting.
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
