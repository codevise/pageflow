import PageVideoPlayer from './PageVideoPlayer';
import MobilePageVideoPoster from './MobilePageVideoPoster';
import {combine, camelize} from 'utils';

import {fileExists} from 'files/selectors';
import {has} from 'utils/selectors';

import {connect} from 'react-redux';

export function PageBackgroundVideo(props) {
  if (props.hasMobilePlatform && (mobilePosterExists(props) || !props.hasMuteVideoAutoplaySupport)) {
    return (
      <MobilePageVideoPoster page={props.page}
                             propertyNamePrefix={props.propertyNamePrefix} />
    );
  }
  else {
    return (
      <PageVideoPlayer loop={true}
                       fit="cover"
                       muted={props.hasMobilePlatform}
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

export default connect(combine({
  fileExists: fileExists(),
  hasMobilePlatform: has('mobile platform'),
  hasMuteVideoAutoplaySupport: has('mute video autoplay support')
}))(PageBackgroundVideo);
