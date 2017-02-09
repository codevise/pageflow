import classNames from 'classnames';

export default function(props) {
  return (
    <div className={wrapperClassNames(props)}>
      {header(props)}
      <p>{props.description}</p>
    </div>
  );

  function wrapperClassNames(props) {
    return classNames('add_info_box', {
      'empty': !props.title && !props.description,
      'title_empty': !props.title,
      'description_empty': !props.description
    });
  }

  function header(props) {
    if (props.title) {
      return (
        <h3>{props.title}</h3>
      );
    }
  }
}
