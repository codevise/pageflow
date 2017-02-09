export function widgetPresent(typeName) {
  return function(state) {
    return state.widgets[typeName];
  };
}
