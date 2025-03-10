import {getPanZoomStepTransform} from './panZoom';
import {getBoundingRect} from './getBoundingRect';

export function getTooltipInlineStyles({
  area,
  panZoomEnabled, imageFile, containerRect
}) {
  const referencePositionInPercent = getReferencePositionInPercent({area});

  const transform =
    panZoomEnabled ?
    getPanZoomStepTransform({
        areaOutline: area.outline,
        areaZoom: area.zoom || 0,
        imageFileWidth: imageFile?.width,
        imageFileHeight: imageFile?.height,
        containerWidth: containerRect.width,
        containerHeight: containerRect.height
      }) :
      {x: 0, y: 0, scale: 1};

  return {
    reference: {
      left: `${referencePositionInPercent.left}%`,
      top: `${referencePositionInPercent.top}%`,
      height: `${referencePositionInPercent.height}%`
    },
    wrapper: {
      transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale || 1})`,
    }
  };
}

function getReferencePositionInPercent({area}) {
  const referenceType = area.tooltipReference;
  const indicatorRect = getIndicatorRect(area.indicatorPosition);

  if (referenceType === 'area') {
    const boundingRect = getBoundingRect(area.outline);

    return {
      top: boundingRect.top,
      height: boundingRect.height,
      left: indicatorRect.left
    }
  }
  else {
    return indicatorRect;
  }
}

function getIndicatorRect(indicatorPosition = [50, 50]) {
  return {
    left: indicatorPosition[0],
    top: indicatorPosition[1],
    height: 0
  };
}
