/**
 * Find the file references a configuration contains.
 *
 * @param {Object} options
 * @param {Array} options.locations - File reference locations of the subject's schema.
 * @param {Object} options.configuration - Configuration to read perma ids from.
 *
 * @private
 */
export function collectFileReferences({locations, configuration}) {
  return [
    ...locationReferences(locations, configuration),
    ...linkReferences(configuration)
  ];
}

function locationReferences(locations, configuration) {
  return locations.flatMap(location =>
    valuesAt(configuration, location.path)
      .map(({path, value}) => reference({
        collectionName: location.collection,
        value,
        path,
        active: isActive(location.activeIf, configuration)
      }))
      .filter(Boolean)
  );
}

function linkReferences(configuration) {
  return fileLinks(configuration)
    .map(({path, file}) => isCollectionName(file.collectionName) && reference({
      collectionName: file.collectionName,
      value: file.permaId,
      path,
      active: true
    }))
    .filter(Boolean);
}

function reference({collectionName, value, path, active}) {
  const permaId = toPermaId(value);

  return permaId && {collectionName, permaId, path, active};
}

function fileLinks(value, path = []) {
  if (!value || typeof value !== 'object') {
    return [];
  }

  const file = isObject(value.href) ? value.href.file : null;
  const links = isObject(file) ?
    [{path: [...path, 'href', 'file', 'permaId'], file}] :
    [];

  return [
    ...links,
    ...Object.entries(value).flatMap(([key, item]) => fileLinks(item, [...path, key]))
  ];
}

function isObject(value) {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

function isCollectionName(value) {
  return typeof value === 'string' && value.length > 0;
}

// Backdrops of legacy sections store a color in the property that
// otherwise holds an image perma id.
function toPermaId(value) {
  const permaId = Number(value);

  return Number.isInteger(permaId) && permaId > 0 ? permaId : null;
}

function valuesAt(value, path, resolvedPath = []) {
  if (value === null || value === undefined) {
    return [];
  }

  if (!path.length) {
    return [{path: resolvedPath, value}];
  }

  const [segment, ...rest] = path;

  if (segment === '*') {
    return Object.entries(value).flatMap(
      ([key, item]) => valuesAt(item, rest, [...resolvedPath, key])
    );
  }

  return valuesAt(value[segment], rest, [...resolvedPath, segment]);
}

function isActive(activeIf, configuration) {
  if (!activeIf) {
    return true;
  }

  return [activeIf].flat().every(condition => matches(condition, configuration));
}

function matches(condition, configuration) {
  const value = valueAt(configuration, condition.path);

  if ('present' in condition) {
    return (value !== null && value !== undefined) === condition.present;
  }

  if ('not' in condition) {
    return ![condition.not].flat().includes(value);
  }

  return [condition.value].flat().includes(value);
}

function valueAt(configuration, path) {
  return path.reduce((value, segment) => value?.[segment], configuration);
}
