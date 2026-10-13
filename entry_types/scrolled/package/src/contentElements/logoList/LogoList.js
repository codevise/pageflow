import React from 'react';

import {
  Image,
  useContentElementLifecycle,
  useFile
} from 'pageflow-scrolled/frontend';

import styles from './LogoList.module.css';

export function LogoList({configuration}) {
  const {shouldLoad} = useContentElementLifecycle();
  const items = configuration.items || [];

  return (
    <ul className={styles.list}>
      {items.map(item =>
        <Logo key={item.id} image={item.image} load={shouldLoad} />
      )}
    </ul>
  );
}

function Logo({image, load}) {
  const imageFile = useFile({collectionName: 'imageFiles', permaId: image});

  if (!imageFile) {
    return null;
  }

  return (
    <li className={styles.item}>
      <Image imageFile={imageFile}
             load={load}
             variant="medium"
             preferSvg={true}
             fill={false}
             width={imageFile.width}
             height={imageFile.height} />
    </li>
  );
}
