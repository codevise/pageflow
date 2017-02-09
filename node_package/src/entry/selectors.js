export function entryAttribute(name) {
  return function(state) {
    return state.entry[name];
  };
}
