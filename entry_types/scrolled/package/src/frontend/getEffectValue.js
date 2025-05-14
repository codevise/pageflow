export function getEffectValue(file, name) {
  return (file?.effects || []).find(effect => effect.name === name)?.value;
}
