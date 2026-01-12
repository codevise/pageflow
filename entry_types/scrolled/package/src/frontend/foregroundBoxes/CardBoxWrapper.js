import React from 'react';
import classNames from 'classnames';

import {widths} from '../layouts';
import {BackgroundColorProvider} from '../backgroundColor';

import styles from "./CardBoxWrapper.module.css";
import boundaryMarginStyles from "./BoxBoundaryMargin.module.css";

export default function CardBoxWrapper(props) {
  if (outsideBox(props)) {
    return props.children;
  }

  return (
    <div className={className(props)}
         style={{'--card-surface-color': props.cardSurfaceColor}}>
      <BackgroundColorProvider invert>
        {props.children}
      </BackgroundColorProvider>
    </div>
  )
}

function outsideBox(props) {
  return props.position === 'sticky' ||
         (props.position === 'inline' && props.width > widths.md) ||
         props.customMargin
}

function className(props) {
  return classNames(
    styles.card,
    props.inverted ? styles.cardBgBlack : styles.cardBgWhite,
    styles[`selfClear-${props.selfClear}`],
    {[styles.blur]: props.cardSurfaceTransparency > 0},
    {[styles.cardStart]: !props.openStart},
    {[styles.cardEnd]: !props.openEnd},
    {[boundaryMarginStyles.noTopMargin]: props.atSectionStart},
    {[boundaryMarginStyles.noBottomMargin]: props.atSectionEnd}
  );
}
