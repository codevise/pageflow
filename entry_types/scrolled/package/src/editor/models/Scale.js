export function Scale({
  scaleName,
  themeProperties,
  scaleTranslations,
  defaultValuePropertyName,
  scope
}) {
  const root = themeProperties.root || {};

  const scaleProperties = Object.keys(root)
    .filter(name => name.indexOf(`${scaleName}-`) === 0);

  const values = scaleProperties.map(name => name.split('-').pop());
  const texts = values.map(value => scaleTranslations[scaleName]?.[value]);
  const cssValues = scaleProperties.map(propertyName => root[propertyName]);

  return {
    values,
    texts,
    defaultValue: getDefaultValue()
  };

  function getDefaultValue() {
    if (!defaultValuePropertyName) {
      return undefined;
    }

    const defaultCssValue =
      themeProperties[scope]?.[defaultValuePropertyName] ??
      themeProperties.root?.[defaultValuePropertyName];

    if (!defaultCssValue) {
      return undefined;
    }

    const index = cssValues.indexOf(defaultCssValue);
    return index >= 0 ? values[index] : undefined;
  }
}
