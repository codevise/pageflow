import React from 'react';
import classNames from 'classnames';

import {withInlineEditingAlternative} from './inlineEditing';

import styles from './EditableInlineText.module.css';

export const EditableInlineText = withInlineEditingAlternative(
  'EditableInlineText',
  function EditableInlineText({value, hyphens, defaultValue = ''}) {
    return (
      <span className={classNames(styles.root,
                                  {[styles.manualHyphens]: hyphens === 'manual'})}>
        {value ? value[0]?.children[0]?.text : defaultValue}
      </span>
    );
  }
);
