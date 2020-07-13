import React, {createContext, useContext, useEffect, useRef, useMemo} from 'react';
import {media, MultiPlayer, PlayerSourceIDMap} from 'pageflow/frontend';
import {Atmo} from './Atmo';

function getContextValue(updateAtmo, createMediaPlayerHooks){
  let empty = ()=>{};
  return {
    updateAtmo: updateAtmo || empty,
    createMediaPlayerHooks: createMediaPlayerHooks || empty
  }
}

export const AtmoContext = createContext(getContextValue());

export function AtmoProvider({children}){
  let atmoConfig = useRef({});

  useEffect(()=>{
    let currentAtmo = atmoConfig.current;
    currentAtmo.pool = PlayerSourceIDMap(media, {
      playerOptions: {tagName: 'audio', loop: true}
    });
    currentAtmo.multiPlayer = new MultiPlayer(currentAtmo.pool, {
      fadeDuration: 500,
      crossFade: true,
      playFromBeginning: false,
      rewindOnChange: true
    });
    currentAtmo.atmo = new Atmo({
      multiPlayer: currentAtmo.multiPlayer,
      backgroundMedia: media
    });
  }, []);

  let updateAtmo = function ({audioFilePermaId, sources}) {
    let currentAtmo = atmoConfig.current;
    if (currentAtmo.atmo) {
      if (sources) {
        currentAtmo.pool.mapSources(audioFilePermaId, sources);
      }

      currentAtmo.atmo.atmoSourceId = audioFilePermaId;
      currentAtmo.atmo.update();
    }
  };

  let createMediaPlayerHooks = function (options) {
    if (atmoConfig.current.atmo) {
      return atmoConfig.current.atmo.createMediaPlayerHooks(options);
    }
  }

  let contextValue = useMemo(()=>{
    return getContextValue(updateAtmo, createMediaPlayerHooks);
  }, []);

  return (
    <AtmoContext.Provider value={contextValue}>
      {children}
    </AtmoContext.Provider>
  )
};

export function useAtmo() {
  return useContext(AtmoContext);
}
