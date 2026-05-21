import React from 'react';
import {extensible} from './extensionRegistry';
import styles from './Placeholder.module.css';

export const Placeholder = extensible('Placeholder', function Placeholder() {
  return <div className={styles.placeholder} />;
});
