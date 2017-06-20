import Icon from 'components/Icon';
import pageSkipLinkTarget from 'components/pageSkipLinkTarget';

function PlayButton(props) {
  return (
    <a href="#"
       className="waveform_player_controls-play_button"
       id={props.id}
       tabIndex="4"
       title={props.title}
       onClick={clickHandler(props)}>
      <Icon name={props.isPlaying ? 'pause' : 'play'} />
    </a>
  );
}

export default pageSkipLinkTarget(PlayButton);

function clickHandler(props) {
  return event => {
    event.preventDefault();

    if (props.onClick) {
      props.onClick();
    }
  };
}
