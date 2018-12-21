export function entryAttribute(name) {
  return function(state) {
    return state.entry[name];
  };
}

export function isEntryReady(state) {
  return !!state.entry.isReady;
}
