export function useFileWithCropPosition(file, cropPosition) {
  return file && {...file, cropPosition};
}
