import {useRef, useCallback} from 'react';
import {useIsomorphicLayoutEffect} from 'pageflow-scrolled/frontend';

import {useIntersectionObserver} from './useIntersectionObserver';
import {getPanZoomStepTransform} from './panZoom';

export function useScrollPanZoom({imageFile, containerRect, areas, enabled, onChange}) {
  const wrapperRef = useRef();

  const onVisibleIndexChange = useCallback(index => onChange(index - 1), [onChange]);
  const [scrollerRef, setStepRef] = useIntersectionObserver({
    enabled,
    threshold: 0.7,
    onVisibleIndexChange
  });

  const imageFileWidth = imageFile?.width;
  const imageFileHeight = imageFile?.height;

  const containerWidth = containerRect.width;
  const containerHeight = containerRect.height;

  useIsomorphicLayoutEffect(() => {
    if (!enabled || !containerWidth) {
      return;
    }

    const steps = [
      {
        x: 0,
        y: 0,
        scale: 1
      },
      ...areas.map(area => getPanZoomStepTransform({
        areaOutline: area.outline,
        areaZoom: area.zoom || 0,
        imageFileWidth,
        imageFileHeight,
        containerWidth,
        containerHeight
      })),
      {
        x: 0,
        y: 0,
        scale: 1
      }
    ];

    const scrollTimeline = new window.ScrollTimeline({
      source: scrollerRef.current,
      axis: 'inline'
    });

    const animation = wrapperRef.current.animate(
      steps.map(keyframe),
      {
        fill: 'both',
        timeline: scrollTimeline
      }
    );

    return () => animation.cancel();
  }, [
    areas,
    enabled,
    imageFileWidth,
    imageFileHeight,
    containerWidth,
    containerHeight
  ]);

  return [wrapperRef, scrollerRef, setStepRef];
}

function keyframe(step) {
  return {
    transform: `translate(${step.x}px, ${step.y}px) scale(${step.scale})`,
    easing: 'ease',
  };
}
