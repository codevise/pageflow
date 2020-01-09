import React from 'react';
import classNames from 'classnames';

import Fullscreen from './Fullscreen';
import {Image} from './Image';
import Video from './Video';
import FillColor from './FillColor';
import {MotifArea} from './MotifArea';
import useDimension from './useDimension';

import videos from './videos';
import BeforeAfter from './BeforeAfter';

import styles from './Backdrop.module.css';

export function Backdrop(props) {
  const [containerDimension, setContainerRef] = useDimension();

  return (
    <div className={classNames(styles.Backdrop,
                               props.transitionStyles.backdrop,
                               props.transitionStyles[`backdrop-${props.state}`],
                               {[styles.offScreen]: props.offScreen})}>
      <div className={props.transitionStyles.backdropInner}>
        <div className={props.transitionStyles.backdropInner2}>
          {props.children(renderContent(props, containerDimension, setContainerRef))}
        </div>
      </div>
    </div>
  );
}

Backdrop.defaultProps = {
  transitionStyles: {}
};

function renderContent(props, containerDimension, setContainerRef) {
  if (props.image.toString().startsWith('#')) {
    return (
      <FillColor color={props.image} />
    );
  }
  else if (props.image.toString().startsWith('video')) {
    const video = videos[props.image];

    return (
      <Fullscreen ref={setContainerRef}>
        <Video state={props.onScreen ? 'active' : 'inactive'}
               id={props.image}
               offset={props.offset}
               interactive={props.interactive}
               nextSectionOnEnd={props.nextSectionOnEnd} />
        <MotifArea ref={props.motifAreaRef}
                   image={video}
                   containerWidth={containerDimension.width}
                   containerHeight={containerDimension.height} />
      </Fullscreen>
    );
  }
  else if (props.image.toString().startsWith('beforeAfter')) {
    return (
      <Fullscreen ref={setContainerRef}>
        <BeforeAfter state={props.state} leftImageLabel={props.leftImageLabel} rightImageLabel={props.rightImageLabel} startPos={props.startPos} slideMode={props.slideMode} />
      </Fullscreen>
    );
  }
  else {
    return (
      <Fullscreen ref={setContainerRef}>
        <Image id={props.image} />
        <Image id={props.imageMobile} mobile={true} />
        <MotifArea ref={props.motifAreaRef}
                   imageId={props.image}
                   containerWidth={containerDimension.width}
                   containerHeight={containerDimension.height} />
      </Fullscreen>
    );
  }
}
