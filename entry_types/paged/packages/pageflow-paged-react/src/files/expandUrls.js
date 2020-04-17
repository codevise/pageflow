export default function(collectionName, file, urlTemplates) {
  if (!file) {
    return null;
  }

  if (!urlTemplates[collectionName]) {
    throw new Error(`No file url templates found for ${collectionName}`);
  }

  const variants = file.variants ||
                   Object.keys(urlTemplates[collectionName]);

  const urls = variants.reduce((result, variant) => {
    const url = getFileUrl(collectionName,
                           file,
                           variant,
                           urlTemplates);

    if (url) {
      result[variant] = url;
    }

    return result;
  }, {});

  return {
    urls,
    ...file
  };
}

function getFileUrl(collectionName, file, quality, urlTemplates) {
  const templates = urlTemplates[collectionName];

  const template = templates[quality];

  if (template) {
    return template
      .replace(':id_partition', idPartition(file.id))
      .replace(':basename', file.basename);
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
