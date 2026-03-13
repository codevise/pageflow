import React from 'react';
import classNames from 'classnames';

import {widths} from '../layouts';
import {BackgroundColorProvider} from '../backgroundColor';
import {TrimDefaultMarginTop} from '../TrimDefaultMarginTop';

import styles from "./CardBoxWrapper.module.css";
import boundaryMarginStyles from "./BoxBoundaryMargin.module.css";

export default function CardBoxWrapper(props) {
  if (outsideBox(props)) {
    return (
      <TrimDefaultMarginTop value={props.atSectionStart}>
        <div className={props.transitionStyles.foregroundOpacity}>
          {props.children}
        </div>
      </TrimDefaultMarginTop>
    );
  }

  return (
    <div className={className(props)}>
      <div className={classNames(styles.cardBg, props.transitionStyles.foregroundOpacity)}
           style={props.overlayStyle} />
      <div className={classNames(styles.cardContent, props.transitionStyles.foregroundOpacity)}>
        <BackgroundColorProvider invert>
          {props.children}
        </BackgroundColorProvider>
      </div>
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
    {[styles.cardStart]: !props.openStart},
    {[styles.cardEnd]: !props.openEnd},
    {[styles.cardEndPadding]: !props.openEnd && !props.lastMarginBottom},
    {[boundaryMarginStyles.noTopMargin]: props.atSectionStart},
    {[boundaryMarginStyles.noBottomMargin]: props.atSectionEnd}
  );
}
