import PageVideoPlayer from './PageVideoPlayer';
import MobilePageVideoPoster from './MobilePageVideoPoster';
import {combineSelectors, camelize} from 'utils';

import {fileExists} from 'files/selectors';
import {has} from 'utils/selectors';

import {connect} from 'react-redux';

export function PageBackgroundVideo(props) {
  if (props.hasMobilePlatform && mobilePosterExists(props)) {
    return (
      <MobilePageVideoPoster page={props.page}
                             propertyNamePrefix={props.propertyNamePrefix} />
    );
  }
  else {
    return (
      <PageVideoPlayer loop={true}
                       fit="cover"
                       muted={!props.hasAutoplaySupport}
                       playsInline={true}
                       textTracksEnabled={false}
                       {...props} />
    );
  }
}

function mobilePosterExists(props) {
  const property = camelize.concat(props.propertyNamePrefix, 'mobilePosterImageId');
  return props.fileExists('imageFiles', props.page[property]);
}

export default connect(combineSelectors({
  fileExists: fileExists(),
  hasMobilePlatform: has('mobile platform'),
  hasAutoplaySupport: has('autoplay support')
}))(PageBackgroundVideo);
