import React from 'react';
import classNames from 'classnames';

import {withInlineEditingAlternative} from './inlineEditing';

import styles from './EditableInlineText.module.css';

export const EditableInlineText = withInlineEditingAlternative(
  'EditableInlineText',
  function EditableInlineText({value, hyphens, defaultValue = ''}) {
    const text = value ? value[0]?.children[0]?.text : defaultValue;

    return (
      <span className={classNames(styles.root,
                                  styles.textEffects,
                                  styles[`hyphens-${hyphens}`])}>
        <span>{text}</span>
      </span>
    );
  }
);
