import React, {createContext, useContext} from 'react';
import classNames from 'classnames';

import {withInlineEditingDecorator} from './inlineEditing';

import styles from './Foreground.module.css';

export const ForcePaddingContext = createContext(false);

export const Foreground = withInlineEditingDecorator('ForegroundDecorator', function Foreground(props) {
  const forcePadding = useContext(ForcePaddingContext);

  return (
    <div className={className(props, forcePadding)}
         style={{minHeight: props.minHeight}}>
      {props.children}
    </div>
  );
});

function className(props, forcePadding) {
  return classNames(
    styles.Foreground,
    props.transitionStyles.foreground,
    props.transitionStyles[`foreground-${props.state}`],
    {[styles.paddingBottom]: props.paddingBottom},
    {[styles.forcePadding]: forcePadding},
    styles[`${props.heightMode}Height`],
    styles[spaceClassName(props.section?.remainingVerticalSpace)]
  )
}

function spaceClassName(remainingVerticalSpace) {
  if (remainingVerticalSpace === 'above') {
    return 'spaceAbove';
  }
  else if (remainingVerticalSpace === 'below') {
    return 'spaceBelow';
  }
}
