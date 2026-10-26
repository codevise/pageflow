import React, {useState, useContext, useMemo, useCallback, useRef} from 'react';

import {extendMultiSelection, isInMultiSelection} from './multiSelection';

const Context = React.createContext({});

export function EditorStateProvider(props) {
  const [selection, setSelectionState] = useState(null);
  const selectionRef = useRef(null);

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

    selectionRef.current = selection;
    setSelectionState(selection);
  }, []);

  const extendSelection = useCallback(options => {
    setSelection(extendMultiSelection(selectionRef.current, options));
  }, [setSelection]);

  const value = useMemo(() => ({
    selection, setSelection, extendSelection
  }), [setSelection, extendSelection, selection])

  return (
    <Context.Provider value={value}>
      {props.children}
    </Context.Provider>
  );
}

export function useEditorSelection(options) {
  const {selection, setSelection, extendSelection: extend} = useContext(Context);

  const resetSelection = useCallback(() => {
    setSelection(null);
  }, [setSelection])

  const select = useCallback(selection => {
    setSelection(selection || options)
  }, [setSelection, options])

  const extendSelection = useCallback(() => {
    extend(options)
  }, [extend, options])

  return useMemo(() => {
    if (!setSelection) return {};

    const isSelected = !!(selection && options &&
                          selection.id === options.id &&
                          selection.type === options.type &&
                          selection.subjectType === options.subjectType &&
                          selection.subjectId === options.subjectId);

    return {
      range: selection?.range,
      isSelected,
      isMultiSelected: !!options && isInMultiSelection(selection, options),
      selection: isSelected ? selection : null,
      select,
      extendSelection,
      resetSelection
    };
  }, [options, selection, setSelection, select, extendSelection, resetSelection]);
}
