// For reasons that are beyond me, Storybook's Webpack build fails
// with a "JavaScript heap out of memory" error if this import
// expression lives in inlineEditing/index.js directly. I originally
// intended to hide the import from Webpack by using
// file-replace-loader in Storybook's Webpack config to replace this
// file with an empty one, but found out that extracting the import
// to a separate file apparently is enough.
export function importComponents() {
  return import('./components');
}
