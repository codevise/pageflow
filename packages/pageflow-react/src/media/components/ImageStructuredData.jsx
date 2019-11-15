import {entryAttribute} from 'entry/selectors';
import {file} from 'files/selectors';
import {prop} from 'selectors';

import {connect} from 'react-redux';
import {combineSelectors} from 'utils';

import {ensureProtocol} from 'utils/urls';

import StructuredData from './StructuredData';

function ImageStructuredData({file, entryPublishedAt}) {
  if (file) {
    const data = {
      '@context': 'http://schema.org',
      '@type': 'ImageObject',
      name: file.basename,
      description: file.alt,
      url: ensureProtocol('https', file.urls.large),
      width: file.width,
      height: file.height,
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
  else {
    return null;
  }
}

export default connect(combineSelectors({
  file: file('imageFiles', {id: prop('fileId')}),
  entryPublishedAt: entryAttribute('publishedAt')
}))(ImageStructuredData);
