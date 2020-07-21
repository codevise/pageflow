import React from 'react';

import {
  useContentElementLifecycle,
  useContentElementEditorState
} from 'pageflow-scrolled/frontend';
import {useIframeHeight} from './useIframeHeight';

import styles from './DataWrapperChart.module.css';

export function DataWrapperChart({configuration}) {
  const {isPrepared} = useContentElementLifecycle();
  const {isEditable, isSelected} = useContentElementEditorState();
  const height = useIframeHeight(configuration.url);

  // remove url protocol, so that it is selected by the browser itself
  var srcURL = '';
  if (configuration.url && isPrepared) {
    srcURL = configuration.url.replace(/http(s|):/, '');
  }

  return (
    <div className={styles.container}
         style={{pointerEvents: isEditable && !isSelected ? 'none' : undefined,
                 height: height}}
         data-percy="hide">
      {renderIframe(srcURL)}
    </div>
  );
}

function renderIframe(url) {
  if (!url) {
    return null;
  }

  return (
    <iframe src={url}
            scrolling='auto'
            frameBorder='0'
            align='aus'
            allowFullScreen={true}
            mozallowfullscreen='true'
            webkitallowfullscreen='true' />
    )
}
