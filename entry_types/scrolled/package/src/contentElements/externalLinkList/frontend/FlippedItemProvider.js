import React, {useContext, useCallback, useEffect, useMemo, useRef, useState} from 'react';

const FlippedItemContext = React.createContext();

export function FlippedItemProvider({children}) {
  const [flippedId, setFlippedId] = useState(null);
  const value = useMemo(() => [flippedId, setFlippedId], [flippedId]);

  const ref = useRef();

  useEffect(() => {
    function reset(event) {
      if (!ref.current.contains(event.target)) {
        setFlippedId(currentFlippedId => {
          if (currentFlippedId !== flippedId) {
            // Do not reset, if state has already been altered in this
            // click event by a flip action button. Since flip action
            // buttons live in floating portals, they are not handled
            // by the the above contains check.
            return currentFlippedId;
          }
          else {
            return null;
          }
        });
      }
    }

    if (flippedId) {
      document.addEventListener('click', reset);
      return () => document.removeEventListener('click', reset);
    }
  }, [flippedId]);

  return (
    <div ref={ref}>
      <FlippedItemContext.Provider value={value}>
        {children}
      </FlippedItemContext.Provider>
    </div>
  );
};

export function useFlippedItem(id) {
  const [flippedId, setFlippedId] = useContext(FlippedItemContext);

  const toggle = useCallback(() => {
    setFlippedId(flippedId => flippedId === id ? null : id);
  }, [id, setFlippedId]);

  return [
    flippedId === id,
    toggle
  ];
}
