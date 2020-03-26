import classNames from 'classnames';
import Icon from '../Icon';
import styles from './PlayerControls.module.css'
function PlayButton(props) {
  return (
    <a className={className(props)}
       href=""
       tabIndex="4"
       id={props.id}
       title={props.title}
       onClick={clickHandler(props)}>
       {icon(props)}
    </a>
  );
}

export default PlayButton;

function className(props) {
  return classNames('vjs-play-control', styles.play_button_inner,
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
      <Icon name={props.iconName} {...props} />
    );
  }
  else {
    return (
      <span />
    );
  }
}
