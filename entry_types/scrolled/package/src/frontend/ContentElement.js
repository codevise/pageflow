import React from 'react';

import {api} from './api';
import {withInlineEditingDecorator} from './inlineEditing';

import styles from './ContentElement.module.css';

export const ContentElement = withInlineEditingDecorator(
  'ContentElementDecorator',
  function ContentElement(props) {
    const Component = api.contentElementTypes.getComponent(props.type);

    if (Component) {
      return (
        <Component sectionProps={props.sectionProps}
                   configuration={props.itemProps}
                   contentElementId={props.id} />
      );
    }
    else {
      return <div className={styles.missing}>Element of unknown type "{props.type}"</div>
    }
  }
);
