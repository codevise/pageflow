import {combineReducers} from 'redux';

export default function PageTypeRegistry() {
  const pageTypes = [];

  this.register = function(name, {component, reduxModules = [], ...options}) {
    if (!component) {
      fail('Requires component option to be present');
    }

    if (!Array.isArray(reduxModules)) {
      fail('Expected reduxModules option to be an array.');
    }

    const sagas = [];
    const reducers = reduxModules.reduce((result, module) => {
      if (typeof module !== 'object' ||
          new Set(Object.keys(module).concat(['name', 'reducers', 'saga'])).size != 3) {
        fail('Expected redux module to be object with name, reducers and saga properties at most.');
      }

      if (module.reducers && typeof module.reducers !== 'object') {
        fail(`Expected reducers property of ${module.name} reduxModule to be object.`);
      }

      if (module.saga) {
        sagas.push(module.saga);
      }

      return {...result, ...module.reducers};
    }, {});

    pageTypes.push({
      name,
      component,

      reducer: Object.keys(reducers).length ? combineReducers(reducers) : undefined,

      saga: function*() {
        yield sagas.map(saga => saga());
      },

      ...options
    });

    function fail(message) {
      throw new Error(`${message} Check registerPageType call of ${name} page type.`);
    }
  };

  this.forEach = function(...args) {
    return pageTypes.forEach(...args);
  };

  this.reduce = function(...args) {
    return pageTypes.reduce(...args);
  };

  this.findByName = function(pageTypeName) {
    return pageTypes.find(({name, component}) =>
      name == pageTypeName
    );
  };
}
