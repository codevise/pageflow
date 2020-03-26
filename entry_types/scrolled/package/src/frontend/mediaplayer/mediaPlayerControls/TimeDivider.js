import classNames from 'classnames/bind'
import styles from './PlayerControls.module.css';

let cx = classNames.bind(styles)

export default function(props) {
  return (
    <div className={cx("vjs-time-divider", styles.time_divider, props.styles.time_divider, {time_divider_paused: !props.isPlaying})}>
      /
    </div>
  );
}
