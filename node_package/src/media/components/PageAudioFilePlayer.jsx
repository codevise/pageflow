import PageFilePlayer from './PageFilePlayer';
import AudioFilePlayer from './AudioFilePlayer';

export default function PageAudioFilePlayer(props) {
  return (
    <PageFilePlayer {...props} playerComponent={AudioFilePlayer} />
  );
}
