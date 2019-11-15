import Icon from 'components/Icon';
import pageSkipLinkTarget from 'components/pageSkipLinkTarget';

import classNames from 'classnames';

function PlayButton(props) {
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

export default pageSkipLinkTarget(PlayButton);

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
