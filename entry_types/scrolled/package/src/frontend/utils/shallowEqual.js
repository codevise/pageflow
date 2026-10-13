export function shallowEqual(a, b) {
  const keys = Object.keys(a);

  return keys.length === Object.keys(b).length &&
         keys.every(key =>
           Object.prototype.hasOwnProperty.call(b, key) && a[key] === b[key]
         );
}
