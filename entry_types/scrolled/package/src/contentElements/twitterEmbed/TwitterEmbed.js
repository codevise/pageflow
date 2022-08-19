import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';

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
        {shouldLoad ?
         <ThirdPartyOptIn
           providerName="twitter"
           icon={false}
           wrapper={children => <Placeholder>{children}</Placeholder>}>
           <Tweet key={key}
                  url={url}
                  hideConversation={hideConversation}
                  hideMedia={hideMedia} />
         </ThirdPartyOptIn> :
         <Placeholder />}
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
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let isComponentMounted = true
    const options = {
      cards: hideMedia ? "hidden" : "",
      conversation: hideConversation ? "none" : "",
    };

    scriptLoaded().then(() => {
      if (window.twttr.widgets && tweetId) {
        if (isComponentMounted) {
          if (window.twttr.widgets['createTweetEmbed']) {
            window.twttr.widgets.createTweet(
              tweetId,
              ref.current,
              options
            ).then(() => setLoaded(true));
          }
        }
      }
    })

    return () => isComponentMounted = false
  }, [hideMedia, hideConversation, tweetId]);

  return(
    <>
      {!loaded && <Placeholder />}
      <div ref={ref} className={classNames({[styles.loadingContainer]: !loaded})} />
    </>
  );
}
