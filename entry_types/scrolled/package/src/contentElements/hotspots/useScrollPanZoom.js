import {useRef, useCallback, useMemo} from 'react';
import {useIsomorphicLayoutEffect} from 'pageflow-scrolled/frontend';

import {useIntersectionObserver} from './useIntersectionObserver';
import {getPanZoomStepTransform} from './panZoom';

export function useScrollPanZoom({
  imageFile, containerRect, areas,
  enabled, portraitMode,
  onChange
}) {
  const wrapperRef = useRef();
  const indicatorRefs = useRef([]);

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

  const steps = useMemo(() => {
    if (!enabled || !containerWidth) {
      return;
    }

    return [
      {
        x: 0,
        y: 0,
        scale: 1,
        indicators: []
      },
      ...areas.map(area => getPanZoomStepTransform({
        areaOutline: portraitMode ? area.portraitOutline : area.outline,
        areaZoom: (portraitMode ? area.portraitZoom : area.zoom) || 0,
        indicatorPositions: areas.map(area => (portraitMode ? area.portraitIndicatorPosition : area.indicatorPosition) || [50, 50]),
        imageFileWidth,
        imageFileHeight,
        containerWidth,
        containerHeight
      })),
      {
        x: 0,
        y: 0,
        scale: 1,
        indicators: []
      }
    ];
  }, [
    areas,
    enabled,
    imageFileWidth,
    imageFileHeight,
    containerWidth,
    containerHeight,
    portraitMode
  ]);

  const scrollFromTo = useCallback((from, to) => {
    const scroller = scrollerRef.current;
    const step = scroller.children[to + 1];

    scroller.scrollTo(Math.abs(scroller.offsetLeft - step.offsetLeft), 0);

    wrapperRef.current.animate(
      [
        keyframe(steps[from + 1]),
        keyframe(steps[to + 1])
      ],
      {
        duration: 200
      }
    );

    areas.forEach((area, index) => {
      indicatorRefs.current[index].animate(
        [
          keyframe(steps[from + 1].indicators?.[index] || {x: 0, y: 0}),
          keyframe(steps[to + 1].indicators?.[index] || {x: 0, y: 0})
        ],
        {
          duration: 200
        }
      );
    });
  }, [scrollerRef, steps, areas]);

  useIsomorphicLayoutEffect(() => {
    if (!steps) {
      return;
    }

    const scrollTimeline = new window.ScrollTimeline({
      source: scrollerRef.current,
      axis: 'inline'
    });

    const animations = []

    animations.push(wrapperRef.current.animate(
      steps.map(keyframe),
      {
        fill: 'both',
        timeline: scrollTimeline
      }
    ));

    areas.forEach((area, index) => {
      animations.push(indicatorRefs.current[index].animate(
        steps.map(step => keyframe(step.indicators?.[index] || {x: 0, y: 0})),
        {
          fill: 'both',
          timeline: scrollTimeline
        }
      ));
    });

    return () => animations.forEach(animation => animation.cancel());
  }, [areas, steps]);

  const setIndicatorRef = index => ref => {
    indicatorRefs.current[index] = ref;
  }

  return [wrapperRef, scrollerRef, setStepRef, setIndicatorRef, scrollFromTo];
}

function keyframe(step) {
  return {
    transform: `translate(${step.x}px, ${step.y}px) scale(${step.scale || 1})`,
    easing: 'ease',
  };
}
