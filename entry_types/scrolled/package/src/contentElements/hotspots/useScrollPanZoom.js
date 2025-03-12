import {useRef, useCallback, useMemo} from 'react';
import {useIsomorphicLayoutEffect} from 'pageflow-scrolled/frontend';

import {useIntersectionObserver} from './useIntersectionObserver';

export function useScrollPanZoom({
  panZoomTransforms, enabled, onChange
}) {
  const wrapperRef = useRef();
  const scrollerAreasRef = useRef();
  const indicatorRefs = useRef([]);

  const onVisibleIndexChange = useCallback(index => onChange(index - 1), [onChange]);
  const [scrollerRef, setStepRef] = useIntersectionObserver({
    enabled,
    threshold: 0.7,
    onVisibleIndexChange
  });

  const steps = useMemo(() => {
    if (!enabled || !panZoomTransforms.areas.length) {
      return;
    }

    return [
      panZoomTransforms.initial,
      ...panZoomTransforms.areas,
      panZoomTransforms.initial
    ];
  }, [
    panZoomTransforms,
    enabled
  ]);

  const scrollFromToArea = useCallback((from, to) => {
    const scroller = scrollerRef.current;
    const step = scroller.children[to + 1];

    scroller.scrollTo(Math.abs(scroller.offsetLeft - step.offsetLeft), 0);

    if (!steps) {
      return;
    }

    wrapperRef.current.animate(
      [
        keyframe(steps[from + 1].wrapper),
        keyframe(steps[to + 1].wrapper)
      ],
      {
        duration: 200
      }
    );

    panZoomTransforms.areas.forEach((_, index) => {
      indicatorRefs.current[index].animate(
        [
          keyframe(steps[from + 1].indicators[index]),
          keyframe(steps[to + 1].indicators[index])
        ],
        {
          duration: 200
        }
      );
    });
  }, [scrollerRef, steps, panZoomTransforms]);

  useIsomorphicLayoutEffect(() => {
    if (!steps) {
      return;
    }

    const scrollTimeline = new window.ScrollTimeline({
      source: scrollerRef.current,
      axis: 'inline'
    });

    const animations = [];

    [wrapperRef.current, scrollerAreasRef.current].forEach(element =>
      animations.push(element.animate(
        steps.map(step => keyframe(step.wrapper)),
        {
          fill: 'both',
          timeline: scrollTimeline
        }
      ))
    );

    panZoomTransforms.areas.forEach((_, index) => {
      animations.push(indicatorRefs.current[index].animate(
        steps.map(step => keyframe(step.indicators[index])),
        {
          fill: 'both',
          timeline: scrollTimeline
        }
      ));
    });

    return () => animations.forEach(animation => animation.cancel());
  }, [panZoomTransforms, steps]);

  const setIndicatorRef = index => ref => {
    indicatorRefs.current[index] = ref;
  }

  return {
    panZoomRefs: {
      wrapper: wrapperRef,
      scroller: scrollerRef,
      scrollerAreas: scrollerAreasRef,
      setStep: setStepRef,
      setIndicator: setIndicatorRef
    },
    scrollFromToArea
  };
}

function keyframe(transform) {
  return {
    transform,
    easing: 'ease',
  };
}
