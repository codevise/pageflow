import {useMemo} from 'react';

import {
  getInitialTransform,
  getPanZoomStepTransform
} from './panZoom';

import {getBoundingRect} from './getBoundingRect';

export function usePanZoomTransforms({
  containerRect, imageFile, areas, initialTransformEnabled, panZoomEnabled
}) {
  const imageFileWidth = imageFile?.width;
  const imageFileHeight = imageFile?.height;

  const containerWidth = containerRect.width;
  const containerHeight = containerRect.height;

  return useMemo(() => {
    if ((!panZoomEnabled && !initialTransformEnabled) ||
        !containerWidth ||
        !containerHeight ||
        !imageFileWidth ||
        !imageFileHeight) {
      return nullTransforms;
    }

    const indicatorPositions = areas.map(area => area.indicatorPosition);

    const initialTransform =
      initialTransformEnabled ?
      getInitialTransform({
        motifArea: getBoundingRect(areas.flatMap(area => area.outline)),
        imageFileWidth,
        imageFileHeight,
        containerWidth,
        containerHeight,
        indicatorPositions
      }) :
      nullTransform;

    const initialTransformString = toString(initialTransform.wrapper);

    const areaTransformStrings = [];
    const tooltipTransformStrings = [];

    areas.forEach((area, index) => {
      if (panZoomEnabled) {
        const transform = getPanZoomStepTransform({
          areaOutline: area.outline,
          areaZoom: area.zoom,
          initialScale: initialTransform.wrapper?.scale || 1,
          imageFileWidth,
          imageFileHeight,
          containerWidth,
          containerHeight,
          indicatorPositions
        });

        const transformString = toString(transform.wrapper);

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
  return transform &&
         `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale || 1})`;
}

const nullTransforms = {
  initial: {
    indicators: [],
    tooltips: []
  },
  areas: []
};

const nullTransform = {
  indicators: []
};
