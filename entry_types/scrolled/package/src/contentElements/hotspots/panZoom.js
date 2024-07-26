import {getBoundingRect} from './getBoundingRect';

export function getPanZoomStepTransform({
  imageFileWidth, imageFileHeight, areaOutline, areaZoom, containerWidth, containerHeight, indicatorPositions = []
}) {
  if (!containerWidth ||
      !containerHeight ||
      !imageFileWidth ||
      !imageFileHeight) {
    return {x: 0, y: 0, scale: 1};
  }

  const rect = getBoundingRect(areaOutline || []);

  const displayImageWidth = imageFileWidth * containerHeight / imageFileHeight;
  const displayImageHeight = containerHeight;

  const displayAreaWidth = rect.width / 100 * displayImageWidth;
  const displayAreaLeft = rect.left / 100 * displayImageWidth;
  const displayAreaHeight = rect.height / 100 * displayImageHeight;
  const displayAreaTop = rect.top / 100 * displayImageHeight;

  const scale = (100 - areaZoom) / 100 + (areaZoom / 100) * containerHeight / (displayAreaHeight + 0);

  let translateX = (containerWidth - displayAreaWidth * scale) / 2 - displayAreaLeft * scale;
  let translateY = (containerHeight - displayAreaHeight * scale - 0) / 2 - displayAreaTop * scale;

  translateX = Math.min(0, Math.max(containerWidth - displayImageWidth * scale, translateX));
  translateY = Math.min(0, Math.max(containerHeight - displayImageHeight * scale, translateY));

  return {
    x: translateX,
    y: translateY,
    indicators: indicatorPositions.map(indicatorPosition => ({
      x: translateX + displayImageWidth * indicatorPosition[0] / 100 * (scale - 1),
      y: translateY + displayImageHeight * indicatorPosition[1] / 100 * (scale - 1)
    })),
    scale
  };
}
