import {getPanZoomStepTransform} from './panZoom';
import {getBoundingRect} from './getBoundingRect';

export function getTooltipReferencePosition({
  area,
  portraitMode,
  panZoomEnabled, imageFile, containerRect
}) {
  const referenceType = portraitMode ? area.portraitTooltipReference : area.tooltipReference;

  const referencePositionInPercent =
    referenceType === 'area' ?
    getBoundingRect(portraitMode ? area.portraitOutline : area.outline) :
    getIndicatorRect(portraitMode ? area.portraitIndicatorPosition : area.indicatorPosition)

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
    width: containerRect.width * transform.scale * referencePositionInPercent.width / 100,
    height: containerRect.height * transform.scale * referencePositionInPercent.height / 100
  };
}

function getIndicatorRect(indicatorPosition = [50, 50]) {
  return {
    left: indicatorPosition[0],
    top: indicatorPosition[1],
    width: 0,
    height: 0
  };
}
