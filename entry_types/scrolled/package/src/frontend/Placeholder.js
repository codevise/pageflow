import React from 'react';
import {extensible} from './extensions';
import styles from './Placeholder.module.css';

export const Placeholder = extensible('Placeholder', function Placeholder() {
  return <div className={styles.placeholder} />;
});
