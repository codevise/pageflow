import React from 'react';

import {importComponents} from './importComponents';
import {useIsStaticPreview} from '../useScrollPositionLifecycle';

let components = {};

export function loadInlineEditingComponents() {
  return importComponents().then(importedComponents => {
    components = importedComponents;
  });
}

export function withInlineEditingDecorator(name, Component) {
  return function InlineEditingDecorator(props) {
    const Decorator = components[name];
    const isStaticPreview = useIsStaticPreview();

    if (Decorator && !isStaticPreview) {
      return (
        <Decorator {...props}>
          <Component {...props} />
        </Decorator>
      );
    }
    else {
      return <Component {...props} />;
    }
  }
}

export function withInlineEditingAlternative(name, Component) {
  return function InlineEditingDecorator(props) {
    const Alternative = components[name];
    const isStaticPreview = useIsStaticPreview();

    if (Alternative && !isStaticPreview) {
      return <Alternative {...props} />;
    }
    else {
      return <Component {...props} />;
    }
  }
}
