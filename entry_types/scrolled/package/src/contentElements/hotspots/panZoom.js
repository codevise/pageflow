import {getBoundingRect} from './getBoundingRect';

const fullRect = {left: 0, top: 0, width: 100, height: 100};

export function getInitialTransform({
  containerWidth, containerHeight,
  imageFileWidth, imageFileHeight,
  areasBoundingRect,
  indicatorPositions = [],
  containerSafeAreaMargin = 0
}) {
  const baseImageWidth = imageFileWidth * containerHeight / imageFileHeight;
  const baseImageHeight = containerHeight;

  const scaleCover = getScaleToCoverContainerWithRect({
    baseImageWidth,
    baseImageHeight,
    containerWidth,
    containerHeight,
    rect: fullRect
  });

  const scaleContainMotif = getScaleToContainRectInContainer({
    baseImageWidth,
    baseImageHeight,
    containerWidth: containerWidth * (1 - 2 * containerSafeAreaMargin / 100),
    containerHeight,
    rect: areasBoundingRect
  });

  const scale = Math.min(scaleCover, scaleContainMotif);

  const [translateX, translateY] = center({
    baseImageWidth,
    baseImageHeight,
    containerWidth,
    containerHeight,
    scale,
    unbounded: scaleContainMotif < scaleCover,
    rect: areasBoundingRect
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
  const areaRect = getBoundingRect(areaOutline);

  const baseImageWidth = imageFileWidth * containerHeight / imageFileHeight;
  const baseImageHeight = containerHeight;

  const scale = getAreaScale({
    baseImageWidth,
    baseImageHeight,
    containerWidth,
    containerHeight,
    areaRect,
    areaZoom,
    initialScale
  });

  const [translateX, translateY] = center({
    baseImageWidth,
    baseImageHeight,
    containerWidth,
    containerHeight,
    rect: areaRect,
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

function getAreaScale({
  containerWidth, containerHeight,
  baseImageWidth, baseImageHeight,
  areaRect,
  areaZoom,
  initialScale = 1
}) {
  const scale = getScaleToContainRectInContainer({
    containerWidth, containerHeight,
    baseImageWidth, baseImageHeight,
    rect: areaRect
  });

  return (100 - areaZoom) / 100 * initialScale +
         (areaZoom / 100) * scale;
}

function getScaleToCoverContainerWithRect({
  containerWidth, containerHeight,
  baseImageWidth, baseImageHeight,
  rect
}) {
  const [scaleX, scaleY] = getScalesToFit({
    containerWidth, containerHeight,
    baseImageWidth, baseImageHeight,
    rect
  });

  return Math.max(scaleX, scaleY)
};

function getScaleToContainRectInContainer({
  containerWidth, containerHeight,
  baseImageWidth, baseImageHeight,
  rect
}) {
  const [scaleX, scaleY] = getScalesToFit({
    containerWidth, containerHeight,
    baseImageWidth, baseImageHeight,
    rect
  });

  return Math.min(scaleX, scaleY)
};

function getScalesToFit({
  containerWidth, containerHeight,
  baseImageWidth, baseImageHeight,
  rect
}) {
  const baseRectWidth = rect.width / 100 * baseImageWidth;
  const baseRectHeight = rect.height / 100 * baseImageHeight;

  return [
    containerWidth / baseRectWidth,
    containerHeight / baseRectHeight
  ];
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

  return [translateX, translateY];
}
