import React, {useState, useEffect} from 'react';

import Scene from './Scene';
import MutedContext from './MutedContext';
import ScrollToSceneContext from './ScrollToSceneContext';
import {useEntryState} from '../useEntryState';

import styles from './Entry.module.css';

export default function Entry(props) {
  const [{sectionsWithNestedContentElements}, dispatch] = useEntryState(window.pageflowScrolledSeed);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);

  const [scrollTargetSceneIndex, setScrollTargetSceneIndex] = useState(null);

  const [muted, setMuted] = useState(true);

  useEffect(() => {
    if (window.parent) {
      window.addEventListener('message', receive)
      window.parent.postMessage({type: 'READY'}, window.location.origin);
    }

    return () => window.removeEventListener('message', receive);

    function receive(message) {
      if (window.location.href.indexOf(message.origin) === 0 &&
          message.data.type === 'ACTION') {
        dispatch(message.data.payload);
      }
    }
  }, [dispatch]);

  function scrollToScene(index) {
    if (index === 'next') {
      index = currentSceneIndex + 1;
    }

    setScrollTargetSceneIndex(index);
  }

  return (
    <div className={styles.Entry}>
      <MutedContext.Provider value={{muted: muted, setMuted: setMuted}}>
      <ScrollToSceneContext.Provider value={scrollToScene}>
        {renderScenes(sectionsWithNestedContentElements,
                      currentSceneIndex,
                      setCurrentSceneIndex,
                      scrollTargetSceneIndex,
                      setScrollTargetSceneIndex)}
      </ScrollToSceneContext.Provider>
      </MutedContext.Provider>
    </div>
  );
}

function renderScenes(scenes,
                      currentSceneIndex,
                      setCurrentSceneIndex,
                      scrollTargetSceneIndex,
                      setScrollTargetSceneIndex) {
  function onActivate(index) {
    setCurrentSceneIndex(index);
    setScrollTargetSceneIndex(null);
  }

  return scenes.map((scene, index) => {
    const previousScene = scenes[index - 1];
    const nextScene = scenes[index + 1];

    return (
      <Scene key={index}
             state={index > currentSceneIndex ? 'below' : index < currentSceneIndex ? 'above' : 'active'}
             isScrollTarget={index === scrollTargetSceneIndex}
             onActivate={() => onActivate(index)}
             {...scene}
             previousScene={previousScene}
             nextScene={nextScene} />
    );
  });
}
