import {
  getInitialTransform,
  getPanZoomStepTransform
} from './panZoom';

import {getBoundingRect} from './getBoundingRect';

export function usePanZoomTransforms({containerRect, imageFile, areas, panZoomEnabled}) {
  const initialTransform = getInitialTransform({
    motifArea: getBoundingRect(areas.flatMap(area => area.outline || [])),
    imageFileWidth: imageFile?.width,
    imageFileHeight: imageFile?.height,
    containerWidth: containerRect.width,
    containerHeight: containerRect.height,
    indicatorPositions: areas.map(area => area.indicatorPosition || [50, 50])
  });

  return {
    wrapper: toString(initialTransform),
    areas: areas.map((area, index) => ({
      tooltip: toString(
        panZoomEnabled ?
        getPanZoomStepTransform({
          areaOutline: area.outline,
          areaZoom: area.zoom || 0,
          imageFileWidth: imageFile?.width,
          imageFileHeight: imageFile?.height,
          containerWidth: containerRect.width,
          containerHeight: containerRect.height
        }) :
        initialTransform
      ),
      indicator: toString(initialTransform.indicators[index])
    }))
  };
}

function toString(transform) {
  return `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale || 1})`;
}
