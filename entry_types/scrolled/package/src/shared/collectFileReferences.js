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
  return locations.flatMap(location =>
    permaIdsAt(configuration, location.path).map(permaId => ({
      collectionName: location.collection,
      permaId,
      active: isActive(location.activeIf, configuration)
    }))
  );
}

function permaIdsAt(value, path) {
  if (value === null || value === undefined) {
    return [];
  }

  if (!path.length) {
    return [value];
  }

  const [segment, ...rest] = path;

  if (segment === '*') {
    return Object.values(value).flatMap(item => permaIdsAt(item, rest));
  }

  return permaIdsAt(value[segment], rest);
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
