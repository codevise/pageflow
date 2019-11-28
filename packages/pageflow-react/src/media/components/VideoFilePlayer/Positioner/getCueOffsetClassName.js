export default function cueOffsetClassName(dimensions, wrapperDimensions) {
  if (!dimensions || !wrapperDimensions) {
    return;
  }

  const clippedSizeLeft = Math.max(0, -dimensions.left);
  const clippedSizeRight = Math.max(0, dimensions.width - wrapperDimensions.width + dimensions.left);
  const clippedSizeTop = Math.max(0, -dimensions.top);
  const clippedSizeBottom = Math.max(0, dimensions.height - wrapperDimensions.height + dimensions.top);

  return [
    'cue_offset',
    `cue_offset_${Math.ceil(clippedSizeBottom / 10)}`,

    `cue_margin_left_${Math.ceil(clippedSizeLeft / 10)}`,
    `cue_margin_right_${Math.ceil(clippedSizeRight / 10)}`,
    `cue_margin_top_${Math.ceil(clippedSizeTop / 10)}`,
    `cue_margin_bottom_${Math.ceil(clippedSizeBottom / 10)}`
  ].join(' ');
}
