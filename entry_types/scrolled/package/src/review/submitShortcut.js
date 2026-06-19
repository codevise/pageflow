export function isSubmitShortcut(event) {
  return (event.metaKey || event.ctrlKey) && event.key === 'Enter';
}
