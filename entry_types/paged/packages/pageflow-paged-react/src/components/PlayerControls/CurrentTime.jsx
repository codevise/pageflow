import TimeDisplay from './TimeDisplay';

export default function(props) {
  return (
    <TimeDisplay className="vjs-current-time" value={props.currentTime} />
  );
}
