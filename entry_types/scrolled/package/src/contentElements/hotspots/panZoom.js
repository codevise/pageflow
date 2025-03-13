import {getBoundingRect} from './getBoundingRect';

const fullRect = {left: 0, top: 0, width: 100, height: 100};

export function getPanZoomStepTransform({
  containerWidth, containerHeight,
  imageFileWidth, imageFileHeight,
  areaOutline, areaZoom,
  indicatorPositions = [],
  initialScale
}) {
  const rect = getBoundingRect(areaOutline);

  const displayImageWidth = imageFileWidth * containerHeight / imageFileHeight;
  const displayImageHeight = containerHeight;

  const scale = getScale({
    imageFileWidth,
    imageFileHeight,
    containerWidth,
    containerHeight,
    zoom: areaZoom,
    initialScale,
    rect
  });

  const {translateX, translateY} = center({
    imageFileWidth,
    imageFileHeight,
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
      displayImageWidth,
      displayImageHeight,
      translateX,
      translateY,
      scale
    }),
  };
}

export function getInitialTransform({
  containerWidth, containerHeight,
  imageFileWidth, imageFileHeight,
  motifArea,
  indicatorPositions = []
}) {
  const displayImageWidth = imageFileWidth * containerHeight / imageFileHeight;
  const displayImageHeight = containerHeight;

  const scaleCover = getScale({
    imageFileWidth,
    imageFileHeight,
    containerWidth,
    containerHeight,
    zoom: 100,
    rect: fullRect,
    cover: true
  });

  const scaleContainMotif = getScale({
    imageFileWidth,
    imageFileHeight,
    containerWidth,
    containerHeight,
    zoom: 100,
    rect: motifArea
  });

  const scale = Math.min(scaleCover, scaleContainMotif);

  const {translateX, translateY} = center({
    imageFileWidth,
    imageFileHeight,
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
  imageFileWidth, imageFileHeight,
  containerWidth, containerHeight,
  unbounded,
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
  containerWidth, containerHeight,
  imageFileWidth, imageFileHeight,
  rect,
  zoom,
  cover,
  initialScale = 1
}) {
  const displayImageWidth = imageFileWidth * containerHeight / imageFileHeight;
  const displayImageHeight = containerHeight;

  const displayAreaWidth = rect.width / 100 * displayImageWidth;
  const displayAreaHeight = rect.height / 100 * displayImageHeight;

  const scaleX =
    (100 - zoom) / 100 * initialScale +
    (zoom / 100) * containerWidth / displayAreaWidth;

  const scaleY =
    (100 - zoom) / 100 * initialScale +
    (zoom / 100) * containerHeight / displayAreaHeight;

  return cover ? Math.max(scaleX, scaleY) : Math.min(scaleX, scaleY);
}
