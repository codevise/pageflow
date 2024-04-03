import React from 'react';

import {
  ContentElementBox,
  ThirdPartyOptIn,
  useContentElementEditorState,
  ThirdPartyOptOutInfo,
  useContentElementLifecycle
} from 'pageflow-scrolled/frontend';

import styles from './TikTokEmbed.module.css';

export function TikTokEmbed({configuration}) {
  const {url} = configuration;
  const {isEditable, isSelected} = useContentElementEditorState();
  const {shouldLoad} = useContentElementLifecycle();

  return (
    <ContentElementBox>
      <div style={{pointerEvents: isEditable && !isSelected ? 'none' : undefined}}>
        {shouldLoad &&
         <ThirdPartyOptIn
           providerName="tiktok">
           Embed {url}
         </ThirdPartyOptIn>}
        <ThirdPartyOptOutInfo providerName="tiktok" />
      </div>
    </ContentElementBox>
  );
}
