import React from 'react';
import classNames from 'classnames';

import styles from './WheelNumber.module.css';
import {useWheelCharacters} from './useWheelCharacters';

export function WheelNumber({
  value,
  startValue,
  targetValue,
  decimalPlaces,
  locale,
  useGrouping
}) {
  const effectiveStartValue = startValue ?? value;
  const effectiveTargetValue = targetValue ?? value;

  const getCharacters = useWheelCharacters({
    startValue: effectiveStartValue,
    targetValue: effectiveTargetValue,
    decimalPlaces,
    locale,
    useGrouping
  });

  const rotationValues = getCharacters(value);

  return (
    <span className={styles.number}>
      {rotationValues.map((entry, index) =>
        'text' in entry ? (
          <span key={index} className={classNames(styles.text, {[styles.hidden]: entry.hide})}>{entry.text}</span>
        ) : (
          <span key={index} className={styles.wheel} style={{'--val': entry.value}}>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(digit => {
              const isHiddenZero = digit === 0 && entry.hideZero && entry.value < 1;

              return (
                <span key={digit} style={{
                  '--digit': digit,
                  visibility: isHiddenZero ? 'hidden' : undefined
                }}>{digit}</span>
              );
            })}
          </span>
        )
      )}
    </span>
  );
}
