export function getBoundingRect(area) {
  const xCoords = area.map(point => point[0]);
  const yCoords = area.map(point => point[1]);

  const minX = Math.min(...xCoords);
  const maxX = Math.max(...xCoords);
  const minY = Math.min(...yCoords);
  const maxY = Math.max(...yCoords);

  return {
    left: minX,
    top: minY,
    width: maxX - minX,
    height: maxY - minY
  };
}
