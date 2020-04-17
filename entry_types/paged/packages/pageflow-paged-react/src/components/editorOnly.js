export default function(Component) {
  if (!PAGEFLOW_EDITOR) {
    return function() {
      return false;
    };
  }
  else {
    return Component;
  }
}
