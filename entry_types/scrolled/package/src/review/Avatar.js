import React from 'react';

import styles from './Avatar.module.css';

export function Avatar({name, className}) {
  const initial = (name || '?')[0].toUpperCase();
  const hue = nameToHue(name);

  return (
    <span className={`${styles.avatar} ${className || ''}`}
          style={{backgroundColor: `hsl(${hue}, 45%, 40%)`}}>
      {initial}
    </span>
  );
}

export function AvatarStack({names}) {
  const unique = [...new Set(names.filter(Boolean))];

  return (
    <span className={styles.avatarStack}>
      {unique.map((name, i) => (
        <Avatar key={i} name={name} className={styles.stackedAvatar} />
      ))}
    </span>
  );
}

function nameToHue(name) {
  let hash = 0;

  for (let i = 0; i < (name || '').length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  return Math.abs(hash) % 360;
}
