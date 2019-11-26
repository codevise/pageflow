import React, {useState} from 'react';

import Scene from './EditableScene';

import styles from './Entry.module.css';

const ScrollToSceneContext = React.createContext();
export const ScrollToSceneContextConsumer = ScrollToSceneContext.Consumer;

const MutedContext = React.createContext();
export const MutedContextConsumer = MutedContext.Consumer;

const fragment = window.location.hash.replace('#', '');
const localStorageKey = `scene${fragment}`;

window.exportExample = function() {
  console.log(JSON.stringify(JSON.parse(localStorage[localStorageKey]), null, 2));
};

export default function Entry(props) {
  const editMode = window.location.search.indexOf('edit') >= 0;

  const [scenes, setScenes] = useState(fragment && localStorage[localStorageKey] ?
                                       JSON.parse(localStorage[localStorageKey]) :
                                       props.examples[props.defaultExample]);
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
    <div className={styles.Entry}>
      <MutedContext.Provider value={{muted: muted, setMuted: setMuted}}>
      <ScrollToSceneContext.Provider value={scrollToScene}>
        {renderExamplesSelect(props, setScenes, editMode)}
        {renderScenes(scenes,
                      currentSceneIndex,
                      setCurrentSceneIndex,
                      scrollTargetSceneIndex,
                      setScrollTargetSceneIndex,
                      setScenes,
                      editMode)}
      </ScrollToSceneContext.Provider>
      </MutedContext.Provider>
    </div>
  );
}

function renderExamplesSelect(props, setScenes, editMode) {
  if (editMode) {
    return (
      <select className={styles.exampleSelect}
              value="blank"
              onChange={event => updateAndStoreScenes(setScenes, () => props.examples[event.target.value])}>
        <option key="blank" value="blank">(Beispiel laden)</option>
        {Object.keys(props.examples).map(key =>
          <option key={key} value={key}>{key}</option>
         )}
      </select>
    );
  }
}

function renderScenes(scenes,
                      currentSceneIndex,
                      setCurrentSceneIndex,
                      scrollTargetSceneIndex,
                      setScrollTargetSceneIndex,
                      setScenes,
                      editMode) {
  function updateScene(index, properties) {
    const scene = scenes[index];
    const nextScene = scenes[index + 1];
    let nextSceneProperties = {};

    if (properties.fullHeight === false && scene.fullHeight) {
      if (['fade'].indexOf(scene.transition) >= 0) {
        properties = {
          ...properties,
          transition: 'scroll'
        };
      }

      if (['fade'].indexOf(nextScene.transition) >= 0) {
        nextSceneProperties = {
          transition: 'scroll'
        }
      }
    }

    if (properties.backdropImage) {
      properties = {
        invert: properties.backdropImage === '#fff',
        backdrop: {
          ...scene.backdrop,
          image: properties.backdropImage,
        }
      }
    }

    updateScenes(scenes =>
      [
        ...scenes.slice(0, index),
        {...scene, ...properties},
        nextScene && {...nextScene, ...nextSceneProperties},
        ...scenes.slice(index + 2)
      ].filter(Boolean)
    );
  }

  function addItem(index, type) {
    const scene = scenes[index];

    const properties = {
      foreground: [
        ...scene.foreground,
        {type}
      ]
    };

    updateScenes(scenes =>
      [
        ...scenes.slice(0, index),
        {...scene, ...properties},
        ...scenes.slice(index + 1)
      ].filter(Boolean)
    );
  }

  function updateForegroundItemPosition(index, itemIndex, position) {
    const scene = scenes[index];

    const properties = {
      foreground: [
        ...scene.foreground.slice(0, itemIndex),
        {...scene.foreground[itemIndex], position},
        ...scene.foreground.slice(itemIndex + 1),
      ]
    }

    updateScenes(scenes =>
      [
        ...scenes.slice(0, index),
        {...scene, ...properties},
        ...scenes.slice(index + 1)
      ].filter(Boolean)
    );
  }

  function resetItems(index, type) {
    const scene = scenes[index];

    const properties = {
      foreground: []
    };

    updateScenes(scenes =>
      [
        ...scenes.slice(0, index),
        {...scene, ...properties},
        ...scenes.slice(index + 1)
      ].filter(Boolean)
    );
  }

  function updateScenes(fn) {
    updateAndStoreScenes(setScenes, fn);
  }

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
             onAdd={type => addItem(index, type)}
             onForgroundItemPositionChange={(itemIndex, position) => updateForegroundItemPosition(index, itemIndex, position)}
             onReset={type => resetItems(index)}
             onConfigChange={attribute => updateScene(index, attribute)}
             {...scene}
             previousScene={previousScene}
             nextScene={nextScene}
             editMode={editMode} />
    );
  });
}

function updateAndStoreScenes(setScenes, fn) {
  setScenes(scenes => {
    const newScenes = fn(scenes);
    localStorage[localStorageKey] = JSON.stringify(newScenes);
    return newScenes;
  });
}
