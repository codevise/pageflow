export function processImageModifiers(imageModifiers) {
  const cropValue = getModifierValue(imageModifiers, 'crop');
  const isCircleCrop = cropValue === 'circle';

  return {
    aspectRatio: isCircleCrop ? 'square' : cropValue,
    rounded: isCircleCrop ? 'circle' : getModifierValue(imageModifiers, 'rounded')
  };
}

function getModifierValue(imageModifiers, name) {
  return (imageModifiers || []).find(imageModifier => imageModifier.name === name)?.value;
}
