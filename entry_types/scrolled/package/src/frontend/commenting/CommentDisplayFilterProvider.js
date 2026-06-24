import React, {createContext, useContext, useMemo, useState} from 'react';

const CommentDisplayFilterContext = createContext({
  resolution: 'unresolved',
  setResolution: () => {}
});

export function CommentDisplayFilterProvider({children}) {
  const [resolution, setResolution] = useState('unresolved');

  const value = useMemo(() => ({resolution, setResolution}), [resolution]);

  return (
    <CommentDisplayFilterContext.Provider value={value}>
      {children}
    </CommentDisplayFilterContext.Provider>
  );
}

export function useCommentDisplayFilter() {
  return useContext(CommentDisplayFilterContext);
}
