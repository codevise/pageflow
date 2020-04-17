import classNames from 'classnames';

export default function Container(props) {
  return (
    <div className={classNames('controls', props.className)}
         data-role="player_controls"
         onMouseEnter={props.onMouseEnter}
         onMouseLeave={props.onMouseLeave}
         onFocus={props.onFocus}
         onBlur={props.onBlur}>
      {props.children}
    </div>
  );
}
