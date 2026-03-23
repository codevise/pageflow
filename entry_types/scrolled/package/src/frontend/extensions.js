import React from 'react';

import {useIsStaticPreview} from './useScrollPositionLifecycle';

export function extensible(name, Component) {
  return function ExtensibleComponent(props) {
    const isStaticPreview = useIsStaticPreview();

    if (isStaticPreview) {
      return <Component {...props} />;
    }

    const Alternative = alternatives[name];

    if (Alternative) {
      return <Alternative {...props} />;
    }

    const Decorator = decorators[name];

    if (Decorator) {
      return <Decorator {...props}><Component {...props} /></Decorator>;
    }

    return <Component {...props} />;
  };
}

export function provideExtensions({decorators: d, alternatives: a} = {}) {
  decorators = d || {};
  alternatives = a || {};
}

export function clearExtensions() {
  decorators = {};
  alternatives = {};
}

let decorators = {};
let alternatives = {};
