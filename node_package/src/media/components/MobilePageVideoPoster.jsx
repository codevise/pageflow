import {PageBackgroundImage} from 'components';
import {combineSelectors, camelize} from 'utils';

import {fileExists} from 'files/selectors';

import {connect} from 'react-redux';

export function MobilePageVideoPoster(props) {
  const candidate = findCandidate(props);

  if (candidate) {
    return (
      <PageBackgroundImage page={props.page}
                           propertyBaseName={candidate.propertyBaseName}
                           fileCollection={candidate.collection} />
    );
  }
  else {
    return (<noscript />);
  }
}

function findCandidate(props) {
  return candidates(props.propertyNamePrefix).find(candidate =>
    props.fileExists(candidate.collection, props.page[`${candidate.propertyBaseName}Id`])
  );
}

function candidates(prefix) {
  return [
    {
      propertyBaseName: camelize.concat(prefix, 'mobilePosterImage'),
      collection: 'imageFiles'
    },
    {
      propertyBaseName: camelize.concat(prefix, 'posterImage'),
      collection: 'imageFiles'
    },
    {
      propertyBaseName: camelize.concat(prefix, 'videoFile'),
      collection: 'videoFiles'
    },
  ];
}

export default connect(combineSelectors({
  fileExists: fileExists()
}))(MobilePageVideoPoster);
