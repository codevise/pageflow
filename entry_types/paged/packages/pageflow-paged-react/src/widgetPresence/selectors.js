export function widgetPresent(typeName) {
  return function(state) {
    return state.widgetPresence[typeName];
  };
}
