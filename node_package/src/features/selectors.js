export function isFeatureEnabled(name) {
  return function(state) {
    return state.features.indexOf(name) >= 0;
  };
}
