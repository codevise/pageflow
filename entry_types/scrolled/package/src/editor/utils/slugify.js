import charMap from 'pageflow-scrolled/config/slugCharMap.json';

export function slugify(string) {
  return string
    .normalize()
    .split('')
    .map(character =>
      (charMap[character] || character)
        .replace(/[^\w\s$*_+~.()'"!\-:@]+/g, '')
    )
    .join('')
    .trim()
    .replace(/[\s-]+/g, '-')
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-');
}
