export function formatDate(isoString, locale, options) {
  const date = new Date(isoString);
  const fromCurrentYear = date.getFullYear() === new Date().getFullYear();

  return date.toLocaleString(locale, {
    month: 'short',
    day: 'numeric',
    ...(!fromCurrentYear && {year: 'numeric'}),
    ...options
  });
}

export function formatDateTime(isoString, locale) {
  return formatDate(isoString, locale, {hour: 'numeric', minute: '2-digit'});
}
