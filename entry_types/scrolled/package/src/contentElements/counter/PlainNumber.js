import React from 'react';

import styles from './PlainNumber.module.css';

export function PlainNumber({
  value,
  targetValue,
  formatOptions
}) {
  const needsPlaceholder = targetValue != null && targetValue >= value;

  function format(val) {
    return val.toLocaleString(formatOptions.locale, {
      useGrouping: formatOptions.useGrouping,
      minimumFractionDigits: formatOptions.decimalPlaces,
      maximumFractionDigits: formatOptions.decimalPlaces
    });
  }

  if (!needsPlaceholder) {
    return format(value);
  }

  return (
    <span className={styles.numberGrid}>
      <span aria-hidden="true" className={styles.numberPlaceholder}>
        {format(targetValue)}
      </span>
      <span>
        {format(value)}
      </span>
    </span>
  );
}
