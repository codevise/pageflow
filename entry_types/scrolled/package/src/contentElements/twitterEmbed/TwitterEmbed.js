import React, { useEffect, useRef } from 'react';

import {
  ContentElementBox,
  ThirdPartyOptIn,
  useContentElementEditorState,
  ThirdPartyOptOutInfo,
  useContentElementLifecycle
} from 'pageflow-scrolled/frontend';

import {Placeholder} from './Placeholder';

import styles from './TwitterEmbed.module.css';

export function TwitterEmbed({configuration}) {
  const {url, hideConversation, hideMedia} = configuration;
  const {isEditable, isSelected} = useContentElementEditorState();
  const {shouldLoad} = useContentElementLifecycle();

  const key = [
    url,
    hideConversation,
    hideMedia,
  ].join('-');

  return (
    <ContentElementBox>
      <div style={{pointerEvents: isEditable && !isSelected ? 'none' : undefined}}>
        <ThirdPartyOptIn providerName="twitter">
          {shouldLoad &&
           <Tweet key={key}
                  url={url}
                  hideConversation={hideConversation}
                  hideMedia={hideMedia} />}
        </ThirdPartyOptIn>
        <ThirdPartyOptOutInfo providerName="twitter"
                              contentElementPosition={configuration.position} />
      </div>
    </ContentElementBox>
  );
}

function scriptLoaded() {
  const promise = new Promise(resolve => {
    const script = document.createElement("script");
    script.src = "https://platform.twitter.com/widgets.js";

    script.addEventListener('load', resolve);
    document.head.appendChild(script);
  });

  return promise
}

function Tweet({
  url,
  hideConversation,
  hideMedia,
}) {
  const ref = useRef(null)

  const tweetId = url ? url.split('/')[5] : undefined

  useEffect(() => {
    let isComponentMounted = true
    const options = {
      cards: hideMedia ? "hidden" : "",
      conversation: hideConversation ? "none" : "",
    };

    scriptLoaded().then(() => {
      if (window.twttr.widgets && ref.current) {
        if (isComponentMounted) {
          if (window.twttr.widgets['createTweetEmbed']) {
            window.twttr.widgets.createTweetEmbed(
              tweetId,
              ref.current,
              options
            );
          }
        }
      }
    })

    return () => isComponentMounted = false
  }, [hideMedia, hideConversation, tweetId]);

  return(
    <div className={styles.container}>
      {!tweetId && <Placeholder />}
      <div ref={ref} />
    </div>
  );
}
