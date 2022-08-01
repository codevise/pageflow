import React, { useEffect, useRef } from 'react';

import {
  ThirdPartyOptIn,
  useContentElementEditorState,
  ThirdPartyOptOutInfo
} from 'pageflow-scrolled/frontend';

export function TwitterEmbed({configuration}) {
  const {tweetId, hideConversation, hideMedia} = configuration
  const {isEditable, isSelected} = useContentElementEditorState();

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
  }

  return (
    <div style={{pointerEvents: isEditable && !isSelected ? 'none' : undefined}}>
      <ThirdPartyOptIn providerName="twitter">
        <Tweet {...props} />
      </ThirdPartyOptIn>
      <ThirdPartyOptOutInfo providerName="twitter"
                            contentElementPosition={configuration.position} />
    </div>
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

  useEffect(() => {
    let isComponentMounted = true

    scriptLoaded().then(() => {
      if ( window.twttr.widgets && ref.current ) {
        if ( isComponentMounted ) {
          if ( window.twttr.widgets['createTweetEmbed'] ) {
            window.twttr.widgets.createTweetEmbed(
              tweetId,
              ref.current,
              options
            )
          }
        }    
      }
    })

    return () => isComponentMounted = false
  }, [options, tweetId]);

  return(
    <div ref={ref} />
  )
}
