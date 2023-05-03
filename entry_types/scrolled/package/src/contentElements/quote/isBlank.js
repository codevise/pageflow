export function isBlank(value) {
  return value.length === 0 ||
         (value.length === 1 &&
          value[0].children.length <= 1 &&
          !value[0].children[0]?.text);
}
