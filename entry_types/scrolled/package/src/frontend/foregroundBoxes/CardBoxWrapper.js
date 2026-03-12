import React from 'react';
import classNames from 'classnames';

import {widths} from '../layouts';
import {BackgroundColorProvider} from '../backgroundColor';
import {TrimDefaultMarginTop} from '../TrimDefaultMarginTop';
import {isTranslucentColor} from '../utils/isTranslucentColor';

import styles from "./CardBoxWrapper.module.css";
import boundaryMarginStyles from "./BoxBoundaryMargin.module.css";

export default function CardBoxWrapper(props) {
  if (outsideBox(props)) {
    return (
      <TrimDefaultMarginTop value={props.atSectionStart}>
        {props.children}
      </TrimDefaultMarginTop>
    );
  }

  return (
    <div className={className(props)}
         style={cardStyle(props)}>
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

function cardStyle(props) {
  const style = {'--card-surface-color': props.cardSurfaceColor};
  const blur = resolvedBackdropBlur(props);

  if (blur > 0) {
    style['--card-backdrop-blur'] = `blur(${blur / 100 * 10}px)`;
  }

  return style;
}

function resolvedBackdropBlur(props) {
  if (!isTranslucentColor(props.cardSurfaceColor)) {
    return 0;
  }

  return props.overlayBackdropBlur ?? 100;
}

function className(props) {
  return classNames(
    styles.card,
    props.inverted ? styles.cardBgBlack : styles.cardBgWhite,
    {[styles.blur]: resolvedBackdropBlur(props) > 0},
    {[styles.cardStart]: !props.openStart},
    {[styles.cardEnd]: !props.openEnd},
    {[styles.cardEndPadding]: !props.openEnd && !props.lastMarginBottom},
    {[boundaryMarginStyles.noTopMargin]: props.atSectionStart},
    {[boundaryMarginStyles.noBottomMargin]: props.atSectionEnd}
  );
}
