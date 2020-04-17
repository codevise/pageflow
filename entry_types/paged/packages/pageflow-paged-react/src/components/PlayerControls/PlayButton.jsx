import classNames from 'classnames';
import Icon from 'components/Icon';
import pageSkipLinkTarget from 'components/pageSkipLinkTarget';

function PlayButton(props) {
  return (
    <a className={className(props)}
       href="#"
       tabIndex="4"
       id={props.id}
       title={props.title}
       onClick={clickHandler(props)}>
       {icon(props)}
    </a>
  );
}

export default pageSkipLinkTarget(PlayButton);

function className(props) {
  return classNames('vjs-play-control',
                    {'vjs-playing': props.isPlaying},
                    {'player_controls-play_button-custom_icon': !!props.iconName});
}

function clickHandler(props) {
  return event => {
    if (props.onClick) {
      props.onClick(event);
    }

    event.preventDefault();
  };
}

function icon(props) {
  if (props.iconName) {
    return (
      <Icon name={props.iconName} />
    );
  }
  else {
    return (
      <span />
    );
  }
}
