export function camelize(snakeCase) {
  return snakeCase.replace(/[_-][a-z]/g, function(match) {
    return match[1].toUpperCase();
  });
}
