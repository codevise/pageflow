import React, { useEffect, useRef } from 'react';

import {
  ContentElementBox,
  ThirdPartyOptIn,
  useContentElementEditorState,
  ThirdPartyOptOutInfo,
  useContentElementLifecycle
} from 'pageflow-scrolled/frontend';
import styles from './TwitterEmbed.module.css';

export function TwitterEmbed({configuration}) {
  const {tweetId, hideConversation, hideMedia} = configuration;
  const {isEditable, isSelected} = useContentElementEditorState();
  const {shouldLoad} = useContentElementLifecycle();

  const key = [
    tweetId,
    hideConversation,
    hideMedia,
  ].join('-');

  const props = {
    key: key,
    tweetId,
    hideConversation,
    hideMedia,
  };

  return (
    <ContentElementBox>
      <div style={{pointerEvents: isEditable && !isSelected ? 'none' : undefined}}>
        <ThirdPartyOptIn providerName="twitter">
          {shouldLoad && <Tweet {...props} />}
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
  tweetId,
  hideConversation,
  hideMedia,
}) {
  const ref = useRef(null)

  const options = {
    cards: hideMedia ? "hidden" : "",
    conversation: hideConversation ? "none" : "",
  };

  function createTweetEmbed() {
    window.twttr.widgets.createTweetEmbed(
      tweetId,
      ref.current,
      options
    )
  };

  useEffect(() => {
    let isComponentMounted = true

    scriptLoaded().then(() => {
      if ( window.twttr.widgets && ref.current ) {
        if ( isComponentMounted ) {
          if ( window.twttr.widgets['createTweetEmbed'] ) {
            createTweetEmbed();
          }
        }    
      }
    })

    return () => isComponentMounted = false
  }, []);

  return(
    <div className={styles.container}>
      {!tweetId && <Placeholder />}
      <div ref={ref} />
    </div>    
  );
}

function Placeholder() {
  return (
    <div className={styles.placeholder_wrapper}>
      <div className={styles.placeholder_upper_row }>
        <div style={{height: "50px", width: "50px", borderRadius: "50%"}} className={styles.placeholder_item}/>
        <div style={{height: "50px", width: "73%"}} className={styles.placeholder_item}/>
      </div>
      <div style={{height: "200px", width: "85%", marginLeft: "20px"}} className={styles.placeholder_item} />
    </div>
  )
}