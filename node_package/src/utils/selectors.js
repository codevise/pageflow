import hasFeature from './has';

export function prop(path) {
  return function(state, props) {
    const names = path.split('.');

    if (!(names[0] in props)) {
      throw new Error(`Missing required prop ${names[0]}.`);
    }

    return names.reduce((p, name) => (p && p[name]), props);
  };
}

export function has(featureName) {
  return function(_props, _state, browser) {
    return hasFeature(featureName, browser);
  };
}
