import {getBoundingRect} from './getBoundingRect';

export function getTooltipInlineStyles({
  area, panZoomTransform
}) {
  const referencePositionInPercent = getReferencePositionInPercent({area});

  return {
    reference: {
      left: `${referencePositionInPercent.left}%`,
      top: `${referencePositionInPercent.top}%`,
      height: `${referencePositionInPercent.height}%`
    },
    wrapper: {
      transform: panZoomTransform
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
