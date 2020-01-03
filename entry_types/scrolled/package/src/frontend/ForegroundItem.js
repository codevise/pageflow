import React from 'react';

import templates from './foregroundItemTemplates';

export default function ForegroundItem(props) {
  const template = templates[props.type]
  const Component = template.component;

  return (
    <Component {...template.props} {...props.itemProps} />
  );
}
