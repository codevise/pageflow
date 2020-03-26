import TimeDisplay from './TimeDisplay';
import classNames from 'classnames/bind'
import styles from './PlayerControls.module.css';

let cx = classNames.bind(styles)

export default function(props) {
  return (
    <TimeDisplay className={cx("vjs-duration", styles.duration, props.styles.duration, {duration_paused: !props.isPlaying})} value={props.duration} />
  );
}
