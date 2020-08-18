import React from 'react';

import {ensureProtocol} from '../utils/urls';
import {formatTimeDuration} from '../utils/iso8601';
import {useEntryMetadata} from '../../entryState';

import {StructuredData} from '../StructuredData';

export function VideoStructuredData({file}) {
  const entryMedadata = useEntryMetadata();

  const data = {
    '@context': 'http://schema.org',
    '@type': 'VideoObject',
    name: file.basename,
    description: file.configuration.alt,
    url: ensureProtocol('https', file.urls.high),
    thumbnailUrl: ensureProtocol('https', file.urls.posterMedium),
    width: file.width,
    height: file.height,
    duration: formatTimeDuration(file.durationInMs),
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
