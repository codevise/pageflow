import React from 'react';
import createFilePlayer from '../createFilePlayer';
import Positioner from './Positioner';
import sources from './sources';
import {has, preloadImage} from 'utils';

const FilePlayer = createFilePlayer({
  tagName: 'video',
  sources,
  poster
});

export default function VideoFilePlayer(props) {
  return (
    <Positioner videoFile={props.file} fit={props.fit} position={props.position}>
      <FilePlayer file={props.file}
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


export class VideoFilePlayerPreload extends React.Component {
  componentDidMount() {
    const {file, posterImageFile, preloadImage} = this.props;
    const posterUrl = poster(file, posterImageFile);

    if (posterUrl) {
      preloadImage(posterUrl);
    }
  }

  render() {
    return null;
  }
}

VideoFilePlayerPreload.defaultProps = {
  preloadImage
};

function poster(videoFile, posterImageFile) {
  const style = has('mobile platform') ? 'medium' : 'large';
  return posterImageFile ? posterImageFile.urls[style] : videoFile.urls[`poster_${style}`];
}
