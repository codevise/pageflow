import React from 'react';

import {api} from './api';

export function ContentElement(props) {
  const Component = api.contentElementTypes.getComponent(props.type);

  return (
    <Component configuration={props.itemProps} />
  );
}
