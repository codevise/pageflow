import {entryAttribute} from 'entry/selectors';

import {connect} from 'react-redux';
import {combineSelectors} from 'utils';

import {ensureProtocol} from 'utils/urls';
import {formatTimeDuration} from 'utils/iso8601';

import StructuredData from './StructuredData';

function VideoStructuredData({file, entryPublishedAt}) {
  const data = {
    '@context': 'http://schema.org',
    '@type': 'AudioObject',
    name: file.basename,
    description: file.alt,
    url: ensureProtocol('https', file.urls.mp3),
    duration: formatTimeDuration(file.durationInMs),
    datePublished: entryPublishedAt,
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

export default connect(combineSelectors({
  entryPublishedAt: entryAttribute('publishedAt')
}))(VideoStructuredData);
