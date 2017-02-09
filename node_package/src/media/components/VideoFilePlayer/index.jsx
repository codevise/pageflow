import createFilePlayer from '../createFilePlayer';
import Positioner from './Positioner';
import sources from './sources';
import {has} from 'utils';

const VideoFilePlayer = createFilePlayer({
  tagName: 'video',
  sources,
  poster: (videoFile, posterImageFile) => {
    const style = has('mobile platform') ? 'medium' : 'large';
    return posterImageFile ? posterImageFile.urls[style] : videoFile.urls[`poster_${style}`];
  }
});

export default function(props) {
  return (
    <Positioner videoFile={props.file} fit={props.fit} position={props.position}>
      <VideoFilePlayer file={props.file}
                       posterImageFile={props.posterImageFile}
                       playerState={props.playerState}
                       playerActions={props.playerActions}
                       atmoDuringPlayback={props.atmoDuringPlayback}
                       defaultTextTrackFileId={props.defaultTextTrackFileId}
                       textTracksEnabled={props.textTracksEnabled}
                       loop={props.loop}
                       muted={props.muted}
                       playsInline={props.playsInline} />
    </Positioner>
  );
}
