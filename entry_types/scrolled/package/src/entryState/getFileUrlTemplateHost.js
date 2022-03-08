export function getFileUrlTemplateHost(seed, collectionName, variant) {
  const hlsUrlTemplate = seed.config.fileUrlTemplates[collectionName][variant];
  return hlsUrlTemplate.split('//')[1].split('/')[0];
}
