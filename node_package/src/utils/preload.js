export function preloadBackgroundImage(element) {
  const propertyValue = window.getComputedStyle(element).getPropertyValue('background-image');

  if (propertyValue.match(/^url/)) {
    const url = propertyValue.replace(/^url\(['"]?/, '').replace(/['"]?\)$/, '');
    return preloadImage(url);
  }
}

export function preloadImage(url) {
  return new Promise(resolve => {
    var image = new Image();

    image.onload = resolve;
    image.onerror = resolve;

    image.src = url;
  });
}
