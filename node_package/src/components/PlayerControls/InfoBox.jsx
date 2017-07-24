import classNames from 'classnames';
import withVisibilityWatching from '../withVisibilityWatching';
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
  const titleBlank = isBlank(props.title);
  const descriptionBlank = isBlank(props.description);

  return classNames('add_info_box', {
    'empty': titleBlank && descriptionBlank,
    'title_empty': titleBlank,
    'description_empty': descriptionBlank
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

export default withVisibilityWatching(InfoBox);
