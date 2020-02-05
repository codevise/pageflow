import React from 'react';

import templates from './foregroundItemTemplates';

export function ContentElement(props) {
  const template = templates[props.type]
  const Component = template.component;

  return (
    <Component {...template.props} {...props.itemProps} />
  );
}
