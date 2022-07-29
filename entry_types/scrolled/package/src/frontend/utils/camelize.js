export function camelize(snakeCase) {
  return snakeCase.replace(/-[a-z]/g, function(match) {
    return match[1].toUpperCase();
  });
}
