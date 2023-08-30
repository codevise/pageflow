import React from 'react';

import {
  ContentElementBox,
  ThirdPartyOptIn,
  ThirdPartyOptOutInfo,
  useContentElementLifecycle,
  useContentElementEditorState,
  useI18n,
  ContentElementFigure,
  textColorForBackgroundColor
} from 'pageflow-scrolled/frontend';
import {features} from 'pageflow/frontend';
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
    <ContentElementBox>
      <ContentElementFigure configuration={configuration}>
        <div className={styles.container}
             style={{pointerEvents: isEditable && !isSelected ? 'none' : undefined,
                     backgroundColor,
                     color: textColorForBackgroundColor(backgroundColor),
                     height: height}}
             data-percy="hide">
          <ThirdPartyOptIn providerName="datawrapper">
            {shouldLoad && renderIframe(srcURL,
                                        configuration.title ||
                                        t('pageflow_scrolled.public.chart.default_title'))}
          </ThirdPartyOptIn>
          <DatawrapperOptOutInfo providerName="datawrapper" />
        </div>
      </ContentElementFigure>
    </ContentElementBox>
  );
}

function DatawrapperOptOutInfo(props) {
  if (!features.isEnabled('datawrapper_chart_embed_opt_in')) {
    return null;
  }

  return (
    <ThirdPartyOptOutInfo providerName="datawrapper"
                          {...props} />
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
