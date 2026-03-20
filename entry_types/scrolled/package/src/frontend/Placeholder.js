import React from 'react';
import {withInlineEditingAlternative} from './inlineEditing';
import styles from './Placeholder.module.css';

export const Placeholder = withInlineEditingAlternative('Placeholder', function Placeholder() {
  return <div className={styles.placeholder} />;
});
