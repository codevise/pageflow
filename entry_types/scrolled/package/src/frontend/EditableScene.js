import React from 'react';
import classNames from 'classnames';

import images from '../images';
import Scene from './Scene';

import styles from './EditableScene.module.css';

export default function EditableScene(props) {
  return (
    <div className={classNames(styles.root,
                               {[styles.showBorder]: props.editMode && props.transition.startsWith('fade'),
                                [styles.hideControls]: !props.editMode})}>
      <Scene {...props} />
      <div className={styles.heightSelect}>
        {renderModeSelect(props)}
        {renderBgSelect(props)}
        {renderShadowOpacitySelect(props)}
        {renderForegroundLayoutSelect(props)}
      </div>
      {renderTransitionSelect(props)}
    </div>
  );
}

function renderModeSelect(props) {
  return (
    <select value={props.fullHeight ? 'full' : 'dynamic'}
            onChange={event => props.onConfigChange({fullHeight: event.target.value === 'full'})}>
      <option value="dynamic">Dynamische Höhe</option>
      <option value="full">Volle Höhe</option>
    </select>
  );
}

function renderBgSelect(props) {
  return (
    <select value={props.backdrop.image}
            onChange={event => props.onConfigChange({backdropImage: event.target.value})}>
      {Object.keys(images).concat(['#000', '#fff']).map(id =>
        <option key={id} value={id}>{id}</option>
       )}
    </select>
  );
}

function renderShadowOpacitySelect(props) {
  return (
    <select value={props.shadowOpacity >= 0 ? props.shadowOpacity.toString() : "70"}
            onChange={event => props.onConfigChange({shadowOpacity: parseInt(event.target.value, 10)})}>
      {[0, 20, 50, 70].map(percent =>
        <option key={percent.toString()} value={percent.toString()}>{percent}%</option>
       )}
    </select>
  );
}

function renderForegroundLayoutSelect(props) {
  return (
    <select value={props.layout}
            onChange={event => props.onConfigChange({layout: event.target.value})}>
      <option value="left">Links</option>
      <option value="right">Rechts</option>
      <option value="center">Mittig</option>
    </select>
  );
}

function renderTransitionSelect(props) {
  if (props.previousScene) {
    let options = [
      {value: 'scroll', name: 'Scroll'},
      {value: 'scrollOver', name: 'Scroll Over'},
      {value: 'reveal', name: 'Reveal'},
      {value: 'beforeAfter', name: 'Before/After'}
    ];

    if (props.fullHeight && props.previousScene.fullHeight) {
      options = [
        ...options,
        {value: 'fade', name: 'Fade'},
        {value: 'fadeBg', name: 'Fade Background'}
      ];
    }

    return (
      <select className={styles.transitionSelect}
              value={props.transition}
              onChange={event => props.onConfigChange({transition: event.target.value})}>
        {options.map(option =>
          <option key={option.value} value={option.value}>{option.name}</option>
         )}
      </select>
    );
  }
}
