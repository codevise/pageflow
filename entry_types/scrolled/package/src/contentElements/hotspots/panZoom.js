import {getBoundingRect} from './getBoundingRect';

export function getPanZoomStepTransform({
  imageFileWidth, imageFileHeight, areaOutline, areaZoom, containerWidth, containerHeight, indicatorPositions = []
}) {
  if (!containerWidth ||
      !containerHeight ||
      !imageFileWidth ||
      !imageFileHeight) {
    return {x: 0, y: 0, scale: 1, indicators: indicatorPositions.map(() => ({x: 0, y: 0}))};
  }

  const rect = getBoundingRect(areaOutline);

  const displayImageWidth = imageFileWidth * containerHeight / imageFileHeight;
  const displayImageHeight = containerHeight;

  const scale = getScale({
    imageFileWidth, imageFileHeight, zoom: areaZoom, containerWidth, containerHeight,
    rect
  })

  const {translateX, translateY} = center({
    imageFileWidth, imageFileHeight, containerWidth, containerHeight,
    rect, scale
  })

  return {
    x: translateX,
    y: translateY,
    indicators: transformIndicators({
      indicatorPositions,
      displayImageWidth,
      displayImageHeight,
      translateX,
      translateY,
      scale
    }),
    scale
  };
}

export function getInitialTransform({
  imageFileWidth, imageFileHeight, containerWidth, containerHeight, motifArea, indicatorPositions = []
}) {
  if (!containerWidth ||
      !containerHeight ||
      !imageFileWidth ||
      !imageFileHeight) {
    return {x: 0, y: 0, scale: 1, indicators: indicatorPositions.map(() => ({x: 0, y: 0}))};
  }

  const displayImageWidth = imageFileWidth * containerHeight / imageFileHeight;
  const displayImageHeight = containerHeight;

  const fullRect = {left: 0, top: 0, width: 100, height: 100};

  const scaleCover = getScale({
    imageFileWidth,
    imageFileHeight,
    containerWidth,
    containerHeight,
    zoom: 100,
    rect: fullRect,
    cover: true
  })

  const scaleContainMofif = getScale({
    imageFileWidth,
    imageFileHeight,
    containerWidth,
    containerHeight,
    zoom: 100,
    rect: motifArea
  })

  const scale = Math.min(scaleCover, scaleContainMofif);

  const {translateX, translateY} = center({
    imageFileWidth,
    imageFileHeight,
    containerWidth,
    containerHeight,
    scale,
    unbounded: scaleContainMofif < scaleCover,
    rect: motifArea
  })

  return {
    x: translateX,
    y: translateY,
    scale,
    indicators: transformIndicators({
      indicatorPositions,
      displayImageWidth,
      displayImageHeight,
      translateX,
      translateY,
      scale
    })
  };
}

function transformIndicators({indicatorPositions, displayImageWidth, displayImageHeight, translateX, translateY, scale}) {
  return indicatorPositions.map(indicatorPosition => ({
    x: translateX + displayImageWidth * indicatorPosition[0] / 100 * (scale - 1),
    y: translateY + displayImageHeight * indicatorPosition[1] / 100 * (scale - 1)
  }));
}

export function center({
  imageFileWidth, imageFileHeight, containerWidth, containerHeight, unbounded,
  rect, scale
}) {
  const displayImageWidth = imageFileWidth * containerHeight / imageFileHeight;
  const displayImageHeight = containerHeight;

  const displayAreaWidth = rect.width / 100 * displayImageWidth;
  const displayAreaLeft = rect.left / 100 * displayImageWidth;
  const displayAreaHeight = rect.height / 100 * displayImageHeight;
  const displayAreaTop = rect.top / 100 * displayImageHeight;

  let translateX;
  let translateY;

  if (displayImageWidth * scale < containerWidth) {
    translateX = (containerWidth - displayImageWidth * scale) / 2;
  }
  else {
    translateX = (containerWidth - displayAreaWidth * scale) / 2 - displayAreaLeft * scale;

    if (!unbounded) {
      translateX = Math.min(0, Math.max(containerWidth - displayImageWidth * scale, translateX));
    }
  }

  if (displayImageHeight * scale < containerHeight) {
    translateY = (containerHeight - displayImageHeight * scale) / 2;
  }
  else {
    translateY = (containerHeight - displayAreaHeight * scale) / 2 - displayAreaTop * scale;

    if (!unbounded) {
      translateY = Math.min(0, Math.max(containerHeight - displayImageHeight * scale, translateY));
    }
  }

  return {translateX, translateY};
}

function getScale({
  imageFileWidth, imageFileHeight, zoom, containerWidth, containerHeight,
  rect, cover
}) {
  if (!containerWidth ||
      !containerHeight ||
      !imageFileWidth ||
      !imageFileHeight) {
    return {x: 0, y: 0, scale: 1};
  }

  const displayImageWidth = imageFileWidth * containerHeight / imageFileHeight;
  const displayImageHeight = containerHeight;

  const displayAreaWidth = rect.width / 100 * displayImageWidth;
  const displayAreaHeight = rect.height / 100 * displayImageHeight;

  const scaleX = (100 - zoom) / 100 + (zoom / 100) * containerWidth / displayAreaWidth;
  const scaleY = (100 - zoom) / 100 + (zoom / 100) * containerHeight / displayAreaHeight;

  return cover ? Math.max(scaleX, scaleY) : Math.min(scaleX, scaleY);
}
