import createStore from 'createStore';

import i18n from 'i18n';

const reduxModules = {
  i18n
};

const defaultOptions = {
  locale: 'en'
};

export default function mockContext(reduxModuleNames, options) {
  return {
    store: createStore(reduxModuleNames.map(name => reduxModules[name]),
                       {...defaultOptions, ...options})
  };
}
