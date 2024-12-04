import React from 'react';
import { Node} from 'slate';
import {createRenderElement} from '../../EditableTable';

import styles from './placeholders.module.css';

export function createRenderElementWithPlaceholder(options) {
  const renderElement = createRenderElement(options);

  return function({attributes, children, element}) {
    if ((element.type === 'label' || element.type === 'value') &&
        options.showPlaceholders &&
        Node.string(element) === '') {
      children = <>
        {children}
        <span contentEditable={false}
              className={styles.placeholder}
              data-text={element.type === 'label' ?
                         options.labelPlaceholder :
                         options.valuePlaceholder} />
      </>;
    }

    return renderElement({
      attributes,
      children,
      element
    });
  };
}
