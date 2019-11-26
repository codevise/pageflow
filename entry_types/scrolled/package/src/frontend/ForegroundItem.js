import React from 'react';

import EditInlinePosition from './EditInlinePosition';

import templates from './foregroundItemTemplates';

export default function ForegroundItem(props) {
  const template = templates[props.type]
  const Component = template.component;

  if (template.inlinePositioning) {
    return (
      <EditInlinePosition position={props.position}
                          availablePositions={props.availablePositions}
                          onChange={props.onPositionChange}>
        <Component {...template.props} {...props.itemProps} />
      </EditInlinePosition>
    );
  }
  else {
    return (
      <Component {...template.props} {...props.itemProps} />
    );
  }
}
