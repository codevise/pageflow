import Icon from '../../Icon';

import classNames from 'classnames';

export default function PlayButton(props) {
  return (
    <a href="#"
       className={className(props)}
       id={props.id}
       tabIndex="4"
       title={props.title}
       onClick={clickHandler(props)}>
      <Icon name={props.isPlaying ? 'pause' : 'play'} />
    </a>
  );
}

function className(props) {
  return classNames('waveform_player_controls-play_button', {
    'waveform_player_controls-play_button-inverted': props.inverted
  });
}

function clickHandler(props) {
  return event => {
    event.preventDefault();

    if (props.onClick) {
      props.onClick();
    }
  };
}
