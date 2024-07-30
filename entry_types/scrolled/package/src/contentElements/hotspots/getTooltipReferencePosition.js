import {getPanZoomStepTransform} from './panZoom';
import {getBoundingRect} from './getBoundingRect';

export function getTooltipReferencePosition({
  area,
  portraitMode,
  panZoomEnabled, imageFile, containerRect
}) {
  const referencePositionInPercent = getReferencePositionInPercent({area, portraitMode});

  const transform =
    panZoomEnabled ?
    getPanZoomStepTransform({
        areaOutline: portraitMode ? area.portraitOutline : area.outline,
        areaZoom: (portraitMode ? area.portraitZoom : area.zoom) || 0,
        imageFileWidth: imageFile?.width,
        imageFileHeight: imageFile?.height,
        containerWidth: containerRect.width,
        containerHeight: containerRect.height
      }) :
      {x: 0, y: 0, scale: 1};

  return {
    left: containerRect.width * transform.scale * referencePositionInPercent.left / 100 + transform.x,
    top: containerRect.height * transform.scale * referencePositionInPercent.top / 100 + transform.y,
    height: containerRect.height * transform.scale * referencePositionInPercent.height / 100
  };
}

function getReferencePositionInPercent({area, portraitMode}) {
  const referenceType = portraitMode ? area.portraitTooltipReference : area.tooltipReference;
  const indicatorRect = getIndicatorRect(portraitMode ? area.portraitIndicatorPosition : area.indicatorPosition);

  if (referenceType === 'area') {
    const boundingRect = getBoundingRect(portraitMode ? area.portraitOutline : area.outline);

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
