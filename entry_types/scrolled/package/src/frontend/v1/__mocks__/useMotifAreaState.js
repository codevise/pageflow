let currentState = {};

export function useMotifAreaState() {
  const state = {
    paddingTop: 0,
    isContentPadded: false,
    minHeight: undefined,
    intersectionRatioY: 0,
    isMotifIntersected: false,
    ...currentState
  };

  const setMotifAreaRef = () => {};
  const setContentAreaRef = () => {};

  return [state, setMotifAreaRef, setContentAreaRef];
}

beforeEach(() => {
  currentState = {};
});

useMotifAreaState.mockContentPadded = function() {
  currentState = {
    paddingTop: 100,
    isContentPadded: true
  };
};
