import React from 'react';

import {importComponents} from './importComponents';

let components = {};

export function loadInlineEditingComponents() {
  return importComponents().then(importedComponents => {
    components = importedComponents;
  });
}

export function withInlineEditingDecorator(name, Component) {
  return function InlineEditingDecorator(props) {
    const Decorator = components[name];

    if (Decorator) {
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

    if (Alternative) {
      return <Alternative {...props} />;
    }
    else {
      return <Component {...props} />;
    }
  }
}
