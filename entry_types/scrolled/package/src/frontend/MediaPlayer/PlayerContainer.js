import React, {useEffect, useRef} from 'react';
import {media} from 'pageflow/frontend';

import './videojsBase.module.css';

function PlayerContainer({className, sources, poster, type, playsInline, loop, controls, onSetup, onDispose}){
  const playerWrapperRef = useRef(null);

  useEffect(() => {
    let playerWrapper = playerWrapperRef.current;

    if (sources) {
      let player = media.getPlayer(sources, {
        poster: poster,
        tagName: type,
        playsInline: playsInline,
        loop: loop,
        controls: controls
      });

      let playerElement = player.el();
      playerWrapper.appendChild(playerElement);
      if (onSetup) {
        onSetup(player);
      }

      return () => {
        media.releasePlayer(player);
        playerWrapper.innerHTML = '';
        player.dispose();
        if (onDispose) {
          onDispose();
        }
      }
    }
  });

  return (
    <div className={className} ref={playerWrapperRef}>
    </div>
  );
}

// This function assumes that that the parameters are arrays of
// objects containing only skalar values. It is not a full deep
// equality check, but  suffices for the use case.
function deepEqual(a, b) {
  if (a.length !== b.length) {
    return false;
  }

  for (let i = 0; i < a.length; i++) {
    let aItem = a[i];
    let bItem = b[i];

    if (Object.keys(aItem).length !== Object.keys(bItem).length) {
      return false;
    }

    for (let key in aItem) {
      if (aItem[key] !== bItem[key]) {
        return false;
      }
    }
  }

  return true;
}


function areEqual(prevProps, nextProps) {
  return prevProps.type === nextProps.type &&
         prevProps.playsInline === nextProps.playsInline &&
         prevProps.poster === nextProps.poster &&
         prevProps.loop === nextProps.loop &&
         prevProps.controls === nextProps.controls &&
         deepEqual(prevProps.sources, nextProps.sources)
}

export default React.memo(PlayerContainer, areEqual);
