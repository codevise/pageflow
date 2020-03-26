import TimeDisplay from './TimeDisplay';
import classNames from 'classnames/bind'
import styles from './PlayerControls.module.css';

let cx = classNames.bind(styles)

export default function(props) {
  return (
    <TimeDisplay className={cx("vjs-current-time", styles.current_time, props.styles.current_time, {current_time_paused: !props.isPlaying})} value={props.currentTime} />
  );
}
