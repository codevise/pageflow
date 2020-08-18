import React from 'react';

import {ensureProtocol} from './utils/urls';
import {useEntryMetadata} from '../entryState';

import {StructuredData} from './StructuredData';

export function ImageStructuredData({file}) {
  const entryMedadata = useEntryMetadata();

  const data = {
    '@context': 'http://schema.org',
    '@type': 'ImageObject',
    name: file.basename,
    description: file.configuration.alt,
    url: ensureProtocol('https', file.urls.large),
    width: file.width,
    height: file.height,
    datePublished: entryMedadata.publishedAt,
    uploadDate: file.createdAt,
    copyrightHolder: {
      '@type': 'Organization',
      name: file.rights
    }
  };

  return (
    <StructuredData data={data} />
  );
}
