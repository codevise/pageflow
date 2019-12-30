import React, {useRef} from 'react';
import classNames from 'classnames';

import Fullscreen from './Fullscreen';
import Image from './Image';
import Video from './Video';
import FillColor from './FillColor';
import MotifArea from './MotifArea';
import useDimension from './useDimension';

import images from './images';
import videos from './videos';
import BeforeAfter from './BeforeAfter';

import styles from './Backdrop.module.css';

export default function Backdrop(props) {
  const containerRef = useRef();
  const containerDimension = useDimension(containerRef);

  return (
    <div className={classNames(styles.Backdrop,
                               props.transitionStyles.backdrop,
                               props.transitionStyles[`backdrop-${props.state}`],
                               {[styles.offScreen]: props.offScreen})}>
      <div className={props.transitionStyles.backdropInner}>
        <div className={props.transitionStyles.backdropInner2}>
          {props.children(renderContent(props, containerDimension, containerRef))}
        </div>
      </div>
    </div>
  );
}

function renderContent(props, containerDimension, containerRef) {
  if (props.image.startsWith('#')) {
    return (
      <FillColor color={props.image} />
    );
  }
  else if (props.image.startsWith('video')) {
    const video = videos[props.image];

    return (
      <Fullscreen ref={containerRef}>
        <Video state={props.onScreen ? 'active' : 'inactive'}
               id={props.image}
               offset={props.offset}
               interactive={props.interactive}
               nextSceneOnEnd={props.nextSceneOnEnd} />
        <MotifArea ref={props.motifAreaRef}
                   image={video}
                   containerWidth={containerDimension.width}
                   containerHeight={containerDimension.height} />
      </Fullscreen>
    );
  }
  else if (props.image.startsWith('beforeAfter')) {
    return (
      <Fullscreen ref={containerRef}>
        <BeforeAfter state={props.state} leftImageLabel={props.leftImageLabel} rightImageLabel={props.rightImageLabel} startPos={props.startPos} slideMode={props.slideMode} />
      </Fullscreen>
    );
  }
  else {
    const image = images[props.image];
    const imageMobile = images[props.imageMobile];

    let backgroundImages;

    if (imageMobile === undefined) {
      backgroundImages = <Image id={image.id} focusX={image.focusX} focusY={image.focusY}/>;
    } else {
      backgroundImages = <>
        <Image id={image.id} focusX={image.focusX} focusY={image.focusY}/>
        <Image id={imageMobile.id} focusX={imageMobile.focusX} focusY={imageMobile.focusY}/>
      </>
    }

    return (
      <Fullscreen ref={containerRef}>
        {backgroundImages}
        <MotifArea ref={props.motifAreaRef}
                   image={image}
                   containerWidth={containerDimension.width}
                   containerHeight={containerDimension.height} />
      </Fullscreen>
    );
  }
}
