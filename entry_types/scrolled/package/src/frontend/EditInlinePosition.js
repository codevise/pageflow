import React from 'react';

import styles from './EditInlinePosition.module.css';

export default function EditInlinePosition(props) {
  return (
    <div className={styles.root}>
      {props.children}
      <select className={styles.select}
              value={props.position}
              onChange={event => props.onChange(event.target.value)}>
        {props.availablePositions.map(position =>
          <option key={position} value={position}>{position}</option>
         )}
      </select>
    </div>
  );
}
