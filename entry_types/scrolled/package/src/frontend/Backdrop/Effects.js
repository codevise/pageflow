import React from 'react';

import styles from './Effects.module.css';

export function Effects({file, mobileFile, children}) {
  return (
    <div className={styles.effects}
         style={{
           '--filter': getFilter(file?.effects || []),
           '--mobile-filter': getFilter(mobileFile?.effects || [])
         }}>
      {children}
    </div>
  );
}

export function getFilter(effects) {
  return effects.filter(effect => effect.name !== 'zoom').map(effect => {
    if (effect.name === 'blur') {
      return `blur(${effect.value / 100 * 10}px)`;
    }
    else if (['brightness', 'contrast', 'saturate'].includes(effect.name)) {
      const value = Math.round(effect.value < 0 ?
                               100 + effect.value * 0.6 :
                               100 + effect.value);
      return `${effect.name}(${value}%)`;
    }
    else {
      return `${effect.name}(${effect.value}%)`;
    }
  }).join(' ');
}
