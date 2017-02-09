export default function(selectors) {
  return function(...args) {
    return Object.keys(selectors).reduce((result, key) => {
      if (typeof selectors[key] == 'function') {
        result[key] = selectors[key](...args);
      }
      else {
        result[key] = selectors[key];
      }

      return result;
    }, {});
  };
}
