import PageFilePlayer from './PageFilePlayer';
import AudioFilePlayer from './AudioFilePlayer';
import AudioStructuredData from './AudioStructuredData';

export default function PageAudioFilePlayer(props) {
  return (
    <PageFilePlayer {...props}
                    playerComponent={AudioFilePlayer}
                    structuredDataComponent={AudioStructuredData}/>
  );
}
