import React from 'react';
import Embed from 'react-tiny-oembed';

import {
  ContentElementBox,
  ThirdPartyOptIn,
  useContentElementEditorState,
  ThirdPartyOptOutInfo,
  useContentElementLifecycle,
  useIsStaticPreview
} from 'pageflow-scrolled/frontend';

import styles from './TikTokEmbed.module.css';

const tikTokProvider = {
  provider_name: "TikTok",
  provider_url: "http://www.tiktok.com/",
  endpoints: [
    {
      schemes: [
        "https://www.tiktok.com/*",
        "https://www.tiktok.com/*/video/*"
      ],
      url: "https://www.tiktok.com/oembed"
    }
  ]
};

export function TikTokEmbed({configuration}) {
  const {url} = configuration;
  const {isEditable, isSelected} = useContentElementEditorState();
  const {shouldLoad} = useContentElementLifecycle();
  const isStaticPreview = useIsStaticPreview();

  return (
    <ContentElementBox>
      <div style={{pointerEvents: isEditable && !isSelected ? 'none' : undefined}}>
        <div className={styles.wrapper}>
          {shouldLoad && url && !isStaticPreview &&
           <ThirdPartyOptIn
             providerName="tiktok">
             <div className={styles.inner} data-percy="hide">
               <Embed key={url}
                      url={url}
                      providers={[tikTokProvider]} />
             </div>
           </ThirdPartyOptIn>}
        </div>
        <ThirdPartyOptOutInfo inset providerName="tiktok" />
      </div>
    </ContentElementBox>
  );
}
