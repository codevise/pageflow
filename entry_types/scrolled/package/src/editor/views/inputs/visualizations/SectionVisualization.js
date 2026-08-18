import React from 'react';
import classNames from 'classnames';

import styles from './SectionVisualization.module.css';

export function SectionVisualization({layout, appearance, invert, padded}) {
  const isCards = appearance === 'cards';

  return (
    <div className={classNames(styles.preview, styles[layout], {
      [styles.inverted]: isCards ? !invert : invert,
      [styles.padded]: padded,
      [styles.split]: appearance === 'split',
      [styles.cards]: isCards
    })}>
      <Overlay appearance={appearance} invert={invert} padded={padded} />
      <div className={styles.content}>
        <div className={styles.line} />
        <div className={styles.line} />
        <div className={styles.line} />
        <div className={classNames(styles.line, styles.shortLine)} />
        <div className={styles.gap} />
        <div className={styles.line} />
        <div className={styles.line} />
        <div className={styles.line} />
        <div className={classNames(styles.line, styles.shortLine)} />
      </div>
    </div>
  );
}

function Overlay({appearance, invert, padded}) {
  switch (appearance) {
  case 'shadow':
    return <div className={classNames(styles.shadowOverlay, {[styles.light]: invert, [styles.padded]: padded})} />;
  case 'cards':
    return <div className={classNames(styles.cardBox, {[styles.dark]: invert, [styles.padded]: padded})} />;
  case 'split':
    return <div className={classNames(styles.splitOverlay, {[styles.light]: invert, [styles.padded]: padded})} />;
  default:
    return null;
  }
}
