import React, {useRef} from 'react';
import classNames from 'classnames';

import {Text, useOnScreen} from 'pageflow-scrolled/frontend';

import styles from './DataWrapperChart.module.css';


export function DataWrapperChart({configuration}) {  
  const ref = useRef();
  const onScreen = useOnScreen(ref, '25% 0px 25% 0px');
  // remove url protocol, so that it is selected by the browser itself
  var srcURL = '';
  if (configuration.url && onScreen) {
    srcURL = configuration.url.replace(/http(s|):/, '');
  }
  return (
    <div ref={ref} className={styles.container} data-percy="hide">
      <iframe
        src={srcURL}
        scrolling='auto'
        frameBorder='0'
        align='aus'
        allowFullScreen={true}
        mozallowfullscreen='true'
        webkitallowfullscreen='true' />
    </div>
  );
}
