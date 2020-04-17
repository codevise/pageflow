export function setting({property}) {
  return function(state) {
    return state.settings[property];
  };
}
