import {useMemo} from 'react';

import {
  getInitialTransform,
  getPanZoomStepTransform
} from './panZoom';

import {getBoundingRect} from './getBoundingRect';

export function usePanZoomTransforms({containerRect, imageFile, areas, panZoomEnabled}) {
  const imageFileWidth = imageFile?.width;
  const imageFileHeight = imageFile?.height;

  const containerWidth = containerRect.width;
  const containerHeight = containerRect.height;

  return useMemo(() => {
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

    const areaTransforms = [];
    const tooltipTransforms = [];

    areas.forEach((area, index) => {
      if (panZoomEnabled && containerWidth) {
        const transform = getPanZoomStepTransform({
          areaOutline: area.outline,
          areaZoom: area.zoom,
          imageFileWidth,
          imageFileHeight,
          containerWidth,
          containerHeight,
          indicatorPositions
        });

        const transformString = toString(transform);

        areaTransforms.push({
          wrapper: transformString,
          indicators: toWrapperTransformStrings(transform.indicators)
        });

        tooltipTransforms.push(transformString);
      }
      else {
        tooltipTransforms.push(initialTransformString);
      }
    });

    return {
      initial: {
        wrapper: initialTransformString,
        indicators: toWrapperTransformStrings(initialTransform.indicators),
        tooltips: tooltipTransforms
      },
      areas: areaTransforms
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

function toWrapperTransformStrings(transforms) {
  return transforms.map(transform => ({
    wrapper: toString(transform)
  }));
}

function toString(transform) {
  return `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale || 1})`;
}
