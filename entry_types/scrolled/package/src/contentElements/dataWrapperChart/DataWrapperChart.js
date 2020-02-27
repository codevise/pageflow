import React, {useRef} from 'react';
import classNames from 'classnames';

import {Text, useOnScreen} from 'pageflow-scrolled/frontend';

import styles from './DataWrapperChart.module.css';


export function DataWrapperChart({configuration}) {  
  const ref = useRef();
  const onScreen = useOnScreen(ref, '25% 0px 25% 0px');
  
  return (
    <div ref={ref} className={styles.container}>
      <iframe 
        src={onScreen ? configuration.url : ''}
        scrolling='auto'
        frameBorder='0'
        align='aus'
        allowFullScreen={true}
        mozallowfullscreen='true'
        webkitallowfullscreen='true' />
    </div>
  );
}
