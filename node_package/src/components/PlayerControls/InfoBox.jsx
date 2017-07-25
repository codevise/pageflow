import classNames from 'classnames';
import {isBlank} from 'utils';

function InfoBox(props) {
  return (
    <div className={wrapperClassNames(props)}>
      {header(props)}
      {description(props)}
    </div>
  );
}

function wrapperClassNames(props) {
  return classNames('add_info_box', {
    'empty': isEmpty(props),
    'title_empty': isBlank(props.title),
    'description_empty': isBlank(props.description),
    'add_info_box-hidden_during_playback': props.hiddenDuringPlayback
  });
}

function header(props) {
  if (!isBlank(props.title)) {
    return (
      <h3>{props.title}</h3>
    );
  }
}

function description(props) {
  if (!isBlank(props.description)) {
    return (
      <p dangerouslySetInnerHTML={{__html: props.description}} />
    );
  }
}

export function isEmpty(props) {
  return isBlank(props.title) && isBlank(props.description);
}

export default InfoBox;
