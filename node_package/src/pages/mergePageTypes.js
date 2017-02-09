export default function mergePageTypes(base, mixin) {
  return Object.keys(mixin).reduce((result, memberName) => {
    if (typeof base[memberName] == 'function') {
      result[memberName] = function(...args) {
        base[memberName].apply(this, args);
        return mixin[memberName].apply(this, args);
      };
    }
    else {
      result[memberName] = mixin[memberName];
    }

    return result;
  }, {...base});
}
