import classNames from 'classnames';
import {isBlank} from 'utils';

export default function InfoBox(props) {
  return (
    <div className="waveform_player_controls-info_box">
      {renderTitle(props)}
      {renderDescription(props)}
    </div>
  );
}

function renderTitle(props) {
  if (!isBlank(props.title)) {
    return (
      <h3 className={titleClassName(props)}>{props.title}</h3>
    );
  }
}

function titleClassName(props) {
  const titleAndDescriptionPresent = !isBlank(props.title) && !isBlank(props.description);

  return classNames('waveform_player_controls-info_box-title', {
    'waveform_player_controls-info_box-title-with_separator': titleAndDescriptionPresent
  });
}

function renderDescription(props) {
  if (!isBlank(props.description)) {
    return (
      <p className="waveform_player_controls-info_box-description"
         dangerouslySetInnerHTML={{__html: props.description}} />
    );
  }
}
