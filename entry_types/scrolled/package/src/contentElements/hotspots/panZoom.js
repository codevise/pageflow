import {getBoundingRect} from './getBoundingRect';

const fullRect = {left: 0, top: 0, width: 100, height: 100};

export function getInitialTransform({
  containerWidth, containerHeight,
  imageFileWidth, imageFileHeight,
  motifArea,
  indicatorPositions = []
}) {
  const baseImageWidth = imageFileWidth * containerHeight / imageFileHeight;
  const baseImageHeight = containerHeight;

  const scaleCover = getScale({
    baseImageWidth,
    baseImageHeight,
    containerWidth,
    containerHeight,
    zoom: 100,
    rect: fullRect,
    cover: true
  });

  const scaleContainMotif = getScale({
    baseImageWidth,
    baseImageHeight,
    containerWidth,
    containerHeight,
    zoom: 100,
    rect: motifArea
  });

  const scale = Math.min(scaleCover, scaleContainMotif);

  const {translateX, translateY} = center({
    baseImageWidth,
    baseImageHeight,
    containerWidth,
    containerHeight,
    scale,
    unbounded: scaleContainMotif < scaleCover,
    rect: motifArea
  });

  return {
    wrapper: {
      x: translateX,
      y: translateY,
      scale
    },
    indicators: transformIndicators({
      indicatorPositions,
      baseImageWidth,
      baseImageHeight,
      translateX,
      translateY,
      scale
    })
  };
}

export function getPanZoomStepTransform({
  containerWidth, containerHeight,
  imageFileWidth, imageFileHeight,
  areaOutline, areaZoom,
  indicatorPositions = [],
  initialScale
}) {
  const rect = getBoundingRect(areaOutline);

  const baseImageWidth = imageFileWidth * containerHeight / imageFileHeight;
  const baseImageHeight = containerHeight;

  const scale = getScale({
    baseImageWidth,
    baseImageHeight,
    containerWidth,
    containerHeight,
    zoom: areaZoom,
    initialScale,
    rect
  });

  const {translateX, translateY} = center({
    baseImageWidth,
    baseImageHeight,
    containerWidth,
    containerHeight,
    rect,
    scale
  });

  return {
    wrapper: {
      x: translateX,
      y: translateY,
      scale
    },
    indicators: transformIndicators({
      indicatorPositions,
      baseImageWidth,
      baseImageHeight,
      translateX,
      translateY,
      scale
    }),
  };
}

function transformIndicators({
  indicatorPositions,
  baseImageWidth, baseImageHeight,
  translateX, translateY, scale
}) {
  return indicatorPositions.map(indicatorPosition => ({
    x: translateX + baseImageWidth * indicatorPosition[0] / 100 * (scale - 1),
    y: translateY + baseImageHeight * indicatorPosition[1] / 100 * (scale - 1)
  }));
}

function getScale({
  containerWidth, containerHeight,
  baseImageWidth, baseImageHeight,
  rect,
  zoom,
  cover,
  initialScale = 1
}) {
  const baseRectWidth = rect.width / 100 * baseImageWidth;
  const baseRectHeight = rect.height / 100 * baseImageHeight;

  const scaleX =
    (100 - zoom) / 100 * initialScale +
     (zoom / 100) * containerWidth / baseRectWidth;

  const scaleY =
    (100 - zoom) / 100 * initialScale +
      (zoom / 100) * containerHeight / baseRectHeight;

  return cover ? Math.max(scaleX, scaleY) : Math.min(scaleX, scaleY);
}

export function center({
  baseImageWidth, baseImageHeight,
  containerWidth, containerHeight,
  unbounded,
  rect, scale
}) {
  const displayImageWidth = baseImageWidth * scale;
  const displayImageHeight = baseImageHeight * scale;

  const displayRectWidth = rect.width / 100 * displayImageWidth;
  const displayRectLeft = rect.left / 100 * displayImageWidth;
  const displayRectHeight = rect.height / 100 * displayImageHeight;
  const displayRectTop = rect.top / 100 * displayImageHeight;

  let translateX;
  let translateY;

  if (displayImageWidth < containerWidth) {
    translateX = (containerWidth - displayImageWidth) / 2;
  }
  else {
    translateX = (containerWidth - displayRectWidth) / 2 - displayRectLeft;

    if (!unbounded) {
      translateX = Math.min(0, Math.max(containerWidth - displayImageWidth, translateX));
    }
  }

  if (displayImageHeight < containerHeight) {
    translateY = (containerHeight - displayImageHeight) / 2;
  }
  else {
    translateY = (containerHeight - displayRectHeight) / 2 - displayRectTop;

    if (!unbounded) {
      translateY = Math.min(0, Math.max(containerHeight - displayImageHeight, translateY));
    }
  }

  return {translateX, translateY};
}
