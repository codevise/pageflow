import React, {createContext, useContext, useEffect, useState} from 'react';

import {useIsStaticPreview} from './useScrollPositionLifecycle';

export function extensible(name, Component) {
  return function ExtensibleComponent(props) {
    const isStaticPreview = useIsStaticPreview();
    const extensions = useExtensions();

    if (isStaticPreview) {
      return <Component {...props} />;
    }

    const Alternative = extensions.alternatives[name];

    if (Alternative) {
      return <Alternative {...props} />;
    }

    const Decorator = extensions.decorators[name];

    if (Decorator) {
      return <Decorator {...props}><Component {...props} /></Decorator>;
    }

    return <Component {...props} />;
  };
}

export function provideExtensions({decorators: d, alternatives: a} = {}) {
  decorators = d || {};
  alternatives = a || {};
  notifyListeners();
}

export function clearExtensions() {
  decorators = {};
  alternatives = {};
  notifyListeners();
}

export function ExtensionsProvider({children}) {
  const [version, setVersion] = useState(0);

  useEffect(() => subscribe(() => setVersion(v => v + 1)), []);

  return (
    <ExtensionsContext.Provider value={version}>
      {children}
    </ExtensionsContext.Provider>
  );
}

let decorators = {};
let alternatives = {};
let listeners = [];
const ExtensionsContext = createContext(0);

function useExtensions() {
  useContext(ExtensionsContext);
  return {decorators, alternatives};
}

function subscribe(listener) {
  listeners = [...listeners, listener];
  return () => { listeners = listeners.filter(l => l !== listener); };
}

function notifyListeners() {
  listeners.forEach(l => l());
}
