export default function preloadBackgroundImage(element) {
  const propertyValue = window.getComputedStyle(element).getPropertyValue('background-image');

  if (propertyValue.match(/^url/)) {
    new Image().src = propertyValue.replace(/^url\(['"]?/, '').replace(/['"]?\)$/, '');
  }
}
