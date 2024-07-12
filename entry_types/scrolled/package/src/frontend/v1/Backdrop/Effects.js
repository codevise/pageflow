import React, {useRef} from 'react';
import {useIsomorphicLayoutEffect} from '../../useIsomorphicLayoutEffect';

import styles from '../../Backdrop.module.css';

import {useSectionViewTimeline} from '../../SectionViewTimelineProvider';
import {useSectionLifecycle} from '../../useSectionLifecycle';
import {useIsStaticPreview} from '../../useScrollPositionLifecycle';
import {prefersReducedMotion} from '../../prefersReducedMotion';

export function Effects({file, children}) {
  const ref = useRef();
  const sectionViewTimeline = useSectionViewTimeline();

  const isStaticPreview = useIsStaticPreview();
  const {isVisible} = useSectionLifecycle();

  const scrollParallaxValue = getEffectValue(file, 'scrollParallax');
  const autoZoomValue = getEffectValue(file, 'autoZoom');

  useIsomorphicLayoutEffect(() => {
    if (scrollParallaxValue && !isStaticPreview && sectionViewTimeline) {
      const max = 20 * scrollParallaxValue / 100;
      const scale = 100 + 2 * max;

      const animation = ref.current.animate(
        {
          transform: [
            `translateY(${max}%) scale(${scale}%)`,
            `translateY(${-max}%) scale(${scale}%)`
          ],
        },
        {
          fill: 'forwards',
          timeline: sectionViewTimeline,
          rangeStart: 'cover 0%',
          rangeEnd: 'cover 100%'
        }
      );

      return () => animation.cancel();
    }
  }, [sectionViewTimeline, scrollParallaxValue, isStaticPreview]);

  const x = file?.motifArea ? 50 - (file.motifArea.left + file.motifArea.width / 2) : 0;
  const y = file?.motifArea ? 50 - (file.motifArea.top + file.motifArea.height / 2) : 0;

  useIsomorphicLayoutEffect(() => {
    if (autoZoomValue && isVisible && !prefersReducedMotion()) {
      const animation = ref.current.animate(
        {
          transform: [
            `translate(${-x}%, ${-y}%) scale(1) translate(${x}%, ${y}%)`,
            `translate(${-x}%, ${-y}%) scale(1.2) translate(${x}%, ${y}%)`,
          ]
        },
        {
          iterations: 1,
          fill: 'forwards',
          duration: 1000 * (autoZoomValue / 100) + 40000 * (1 - autoZoomValue / 100),
          composite: 'add',
          easing: 'ease'
        }
      );

      return () => animation.cancel();
    }
  }, [autoZoomValue, isVisible, x, y]);

  return (
    <div ref={ref}
         className={styles.effects}
         style={{filter: getFilter(file?.effects || [])}}>
      {children}
    </div>
  );
}

function getEffectValue(file, name) {
  return (file?.effects || []).find(effect => effect.name === name)?.value;
}

export function getFilter(effects) {
  return effects.map(effect => {
    if (effect.name === 'blur') {
      return `blur(${effect.value / 100 * 10}px)`;
    }
    else if (['brightness', 'contrast', 'saturate'].includes(effect.name)) {
      const value = Math.round(effect.value < 0 ?
                               100 + effect.value * 0.6 :
                               100 + effect.value);
      return `${effect.name}(${value}%)`;
    }
    else if (['grayscale', 'sepia'].includes(effect.name)) {
      return `${effect.name}(${effect.value}%)`;
    }
  }).filter(Boolean).join(' ');
}
