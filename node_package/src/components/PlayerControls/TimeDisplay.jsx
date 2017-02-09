import classNames from 'classnames';

export default function TimeDisplay(props) {
  return (
    <div className={classNames(props.className, 'vjs-current-time')}>
      {format(props.value)}
    </div>
  );
}

TimeDisplay.defaultProps = {
  value: 0
};

function format(value) {
  const seconds = Math.floor(value) % 60;
  const minutes = Math.floor(value / 60) % 60;
  const hours = Math.floor(value / 60 / 60);

  if (hours > 0) {
    return `${hours}:${pad(minutes)}:${pad(seconds)}`;
  }
  else {
    return `${minutes}:${pad(seconds)}`;
  }
}

function pad(value) {
  return value < 10 ? ('0' + value) : value;
}
