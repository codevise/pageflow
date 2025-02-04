import React, {useEffect, useRef} from 'react';
import classNames from 'classnames';

import {
  ThemeIcon,
  WidgetSelectionRect
} from 'pageflow-scrolled/frontend';

import styles from './IconScrollIndicator.module.css';

export function IconScrollIndicator({configuration, sectionLayout}) {
  const ref = useRef();

  useEffect(() => {
    const animation = ref.current.animate(
      {
        opacity: ['100%', '0%'],
        visibility: ['visible', 'hidden']
      },
      {
        fill: 'forwards',
        timeline: new window.ViewTimeline({
          subject: ref.current.closest('section')
        }),
        rangeStart: 'exit-crossing 0%',
        rangeEnd: 'exit-crossing 100px'
      }
    );

    return () => animation.cancel();
  }, []);

  return (
    <div className={classNames(styles.indicator,
                               styles[`animation-${configuration.animation || 'smallBounce'}`],
                               styles[`size-${configuration.size}`],
                               styles[`align-${getAlignment(configuration, sectionLayout)}`])}
         ref={ref}>
      <WidgetSelectionRect>
        <ThemeIcon name="scrollDown" width={30} height={30} />
      </WidgetSelectionRect>
    </div>
  );
}

function getAlignment(configuration, sectionLayout) {
  if (configuration.alignment === 'centerViewport' ||
      sectionLayout === 'center' ||
      sectionLayout === 'centerRagged') {
    return 'center';
  }
  else if (sectionLayout === 'right') {
    return 'right';
  }
  else {
    return 'left';
  }
}
