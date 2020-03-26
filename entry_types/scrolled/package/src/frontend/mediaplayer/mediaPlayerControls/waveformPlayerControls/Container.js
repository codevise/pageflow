import Measure from 'react-measure';

export default function Container(props) {
  return (
    <Measure whitelist={['height']}>
      {
        ({measureRef}) => {
          return (
            <div ref={measureRef} className="waveform_player_controls-container">
              {props.children}
            </div>
          )
        }
      }
    </Measure>
  );
}
