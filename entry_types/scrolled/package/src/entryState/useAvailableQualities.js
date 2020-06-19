const qualities = ['medium', 'fullhd', '4k'];

export function useAvailableQualities(file) {
  if (!file) {
    return [];
  }

  return [
    'auto',
    ...qualities.filter(name => file.variants.includes(name))
  ];
}
