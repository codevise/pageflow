export function extendFile(collectionName, file, config) {
  if (!file) {
    return null;
  }

  const variants = file.variants ?
                   ['original', ...file.variants] :
                   Object.keys(config.fileUrlTemplates[collectionName] || {});

  return {
    ...file,
    modelType: resolveModelType(collectionName, config.fileModelTypes),
    urls: buildUrls(collectionName, file, variants, config.fileUrlTemplates),
    variantWidths: computeVariantWidths(collectionName, file, variants)
  };
}

function resolveModelType(collectionName, modelTypes) {
  if (!modelTypes[collectionName]) {
    throw new Error(`Could not find model type for collection name ${collectionName}`);
  }

  return modelTypes[collectionName];
}

function buildUrls(collectionName, file, variants, urlTemplates) {
  if (!urlTemplates[collectionName]) {
    throw new Error(`No file url templates found for ${collectionName}`);
  }

  return variants.reduce((result, variant) => {
    const url = getFileUrl(collectionName,
                           file,
                           variant,
                           urlTemplates);

    if (url) {
      result[variant] = url;
    }

    return result;
  }, {});
}

function getFileUrl(collectionName, file, quality, urlTemplates) {
  const templates = urlTemplates[collectionName];

  const template = templates[quality];

  if (template) {
    return template
      .replace(':id_partition', idPartition(file.id))
      .replace(':basename', file.basename)
      .replace(':extension', file.extension)
      .replace(':processed_extension', file.processedExtension)
      .replace(':pageflow_hls_qualities', () => hlsQualities(file));
  }
}

function idPartition(id) {
  return partition(pad(id, 9), '/');
}

function partition(string, separator) {
  return string.replace(/./g, function(c, i, a) {
    return i && ((a.length - i) % 3 === 0) ? '/' + c : c;
  });
}

function pad(string, size) {
  return (Array(size).fill(0).join('') + string).slice(-size);
}

function hlsQualities(file) {
  return ['low', 'medium', 'high', 'fullhd', '4k']
    .filter(quality => file.variants.includes(quality))
    .join(',');
}

const variantGeometries = {
  imageFiles: {medium: 1024, large: 1920, ultra: 3840}
};

function computeVariantWidths(collectionName, file, variants) {
  const geometries = variantGeometries[collectionName];

  if (!geometries) {
    return undefined;
  }

  const widthToVariant = {};

  variants.forEach(variant => {
    const geometrySize = geometries[variant];

    if (geometrySize) {
      const key = variantWidth(file, geometrySize) + 'w';

      if (!widthToVariant[key]) {
        widthToVariant[key] = variant;
      }
    }
  });

  return Object.entries(widthToVariant);
}

function variantWidth(file, geometrySize) {
  const {width, height} = file;

  if (!width || !height) {
    return geometrySize;
  }

  const scale = Math.min(geometrySize / width, geometrySize / height, 1);
  return Math.round(width * scale);
}
