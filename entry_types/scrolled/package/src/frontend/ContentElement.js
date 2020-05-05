import React from 'react';

import {api} from './api';
import {withInlineEditingDecorator} from './inlineEditing';

export const ContentElement = withInlineEditingDecorator(
  'ContentElementDecorator',
  function ContentElement(props) {
    const Component = api.contentElementTypes.getComponent(props.type);

    return (
      <Component sectionProps={props.sectionProps}
                 configuration={props.itemProps}
                 contentElementId={props.id} />
    );
  }
);
