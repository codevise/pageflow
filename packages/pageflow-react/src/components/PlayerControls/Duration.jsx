import TimeDisplay from './TimeDisplay';

export default function(props) {
  return (
    <TimeDisplay className="vjs-duration" value={props.duration} />
  );
}
