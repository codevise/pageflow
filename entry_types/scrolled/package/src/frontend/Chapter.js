import React, {useState} from 'react';

import Scene from './Scene';
import MutedContext from './MutedContext';
import ScrollToSceneContext from './ScrollToSceneContext';

export default function Chapter(props) {
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);

  const [scrollTargetSceneIndex, setScrollTargetSceneIndex] = useState(null);

  const [muted, setMuted] = useState(true);

  function scrollToScene(index) {
    if (index === 'next') {
      index = currentSceneIndex + 1;
    }

    setScrollTargetSceneIndex(index);
  }

  return (
    <div id={props.anchor}>
      <MutedContext.Provider value={{muted: muted, setMuted: setMuted}}>
        <ScrollToSceneContext.Provider value={scrollToScene}>
          {renderScenes(props.sections,
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
    )});
}