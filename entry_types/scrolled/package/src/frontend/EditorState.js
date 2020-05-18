import React, {useState, useContext, useMemo, useCallback} from 'react';

const Context = React.createContext({});

export function EditorStateProvider(props) {
  const [selection, setSelectionState] = useState(null);

  const setSelection = useCallback(selection => {
    if (window.parent !== window) {
      window.parent.postMessage(
        {
          type: 'SELECTED',
          payload: selection || {}
        },
        window.location.origin
      );
    }

    setSelectionState(selection);
  }, []);

  const value = useMemo(() => ({
    selection, setSelection
  }), [setSelection, selection])

  return (
    <Context.Provider value={value}>
      {props.children}
    </Context.Provider>
  );
}

export function useEditorSelection(options) {
  const {selection, setSelection} = useContext(Context);

  const resetSelection = useCallback(() => {
    setSelection(null);
  }, [setSelection])

  const select = useCallback(selection => {
    setSelection(selection || options)
  }, [setSelection, options])

  return useMemo(() => (setSelection ? {
    isSelected: selection && options && selection.id === options.id && selection.type === options.type,
    select,
    resetSelection
  } : {}), [options, selection, setSelection, select, resetSelection]);
}
