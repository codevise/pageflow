import {useState, useCallback} from 'react';

let initialState = {};
let setStateRef = null;

export function useMotifAreaState() {
  const [overrides, setOverrides] = useState(initialState);
  setStateRef = setOverrides;

  const state = {
    paddingTop: 0,
    isContentPadded: false,
    minHeight: undefined,
    intersectionRatioY: 0,
    isMotifIntersected: false,
    ...overrides
  };

  const setMotifAreaRef = useCallback(() => {}, []);
  const setContentAreaRef = useCallback(() => {}, []);

  return [state, setMotifAreaRef, setContentAreaRef];
}

beforeEach(() => {
  initialState = {};
  setStateRef = null;
});

useMotifAreaState.mockContentPadded = function() {
  const state = {
    paddingTop: 100,
    isContentPadded: true
  };

  if (setStateRef) {
    setStateRef(state);
  } else {
    initialState = state;
  }
};
