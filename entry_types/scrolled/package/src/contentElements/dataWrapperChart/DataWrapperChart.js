import React from 'react';

import {
  ThirdPartyOptIn,
  ThirdPartyOptOutInfo,
  useContentElementLifecycle,
  useContentElementEditorState,
  useI18n,
  Figure,
  textColorForBackgroundColor
} from 'pageflow-scrolled/frontend';
import {useIframeHeight} from './useIframeHeight';

import styles from './DataWrapperChart.module.css';

export function DataWrapperChart({configuration}) {
  const {t} = useI18n();
  const {shouldLoad} = useContentElementLifecycle();
  const {isEditable, isSelected} = useContentElementEditorState();
  const height = useIframeHeight(configuration.url);

  // remove url protocol, so that it is selected by the browser itself
  var srcURL = '';
  if (configuration.url) {
    srcURL = configuration.url.replace(/http(s|):/, '');
  }

  const backgroundColor = configuration.backgroundColor || '#323d4d';

  return (
    <Figure caption={configuration.caption}>
      <div className={styles.container}
           style={{pointerEvents: isEditable && !isSelected ? 'none' : undefined,
                   backgroundColor,
                   color: textColorForBackgroundColor(backgroundColor),
                   height: height}}
           data-percy="hide">
        <ThirdPartyOptIn providerName="datawrapper">
          <ThirdPartyOptOutInfo providerName="datawrapper"
                                contentElementPosition={configuration.position}>
            {shouldLoad && renderIframe(srcURL,
                                        configuration.title ||
                                        t('pageflow_scrolled.public.chart.default_title'))}
          </ThirdPartyOptOutInfo>
        </ThirdPartyOptIn>
      </div>
    </Figure>
  );
}

function renderIframe(url, title) {
  if (!url) {
    return null;
  }

  return (
    <iframe src={url}
            title={title}
            scrolling="no"
            allowFullScreen={true}
            mozallowfullscreen='true'
            webkitallowfullscreen='true' />
  )
}
