import {useMemo} from 'react';

import {
  getInitialTransform,
  getPanZoomStepTransform
} from './panZoom';

import {getBoundingRect} from './getBoundingRect';

const nullTransforms = {
  initial: {
    indicators: [],
    tooltips: []
  },
  areas: []
};

export function usePanZoomTransforms({containerRect, imageFile, areas, enabled, panZoomEnabled}) {
  const imageFileWidth = imageFile?.width;
  const imageFileHeight = imageFile?.height;

  const containerWidth = containerRect.width;
  const containerHeight = containerRect.height;

  return useMemo(() => {
    if (!enabled ||
        !containerWidth ||
        !containerHeight ||
        !imageFileWidth ||
        !imageFileHeight) {
      return nullTransforms;
    }

    const indicatorPositions = areas.map(area => area.indicatorPosition);

    const initialTransform = getInitialTransform({
      motifArea: getBoundingRect(areas.flatMap(area => area.outline)),
      imageFileWidth,
      imageFileHeight,
      containerWidth,
      containerHeight,
      indicatorPositions
    });

    const initialTransformString = toString(initialTransform)

    const areaTransformStrings = [];
    const tooltipTransformStrings = [];

    areas.forEach((area, index) => {
      if (panZoomEnabled) {
        const transform = getPanZoomStepTransform({
          areaOutline: area.outline,
          areaZoom: area.zoom,
          initialScale: initialTransform.scale,
          imageFileWidth,
          imageFileHeight,
          containerWidth,
          containerHeight,
          indicatorPositions
        });

        const transformString = toString(transform);

        areaTransformStrings.push({
          wrapper: transformString,
          indicators: transform.indicators.map(toString)
        });

        tooltipTransformStrings.push(transformString);
      }
      else {
        tooltipTransformStrings.push(initialTransformString);
      }
    });

    return {
      initial: {
        wrapper: initialTransformString,
        indicators: initialTransform.indicators.map(toString),
        tooltips: tooltipTransformStrings
      },
      areas: areaTransformStrings
    };
  }, [
    panZoomEnabled,
    areas,
    imageFileWidth,
    imageFileHeight,
    containerWidth,
    containerHeight
  ]);
}

function toString(transform) {
  return `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale || 1})`;
}
