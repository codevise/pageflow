import classNames from 'classnames';

/**
 * @desc Use inside {@link
 * pageflow.react.components.PageWrapper|PageWrapper} to build the
 * default page structure.
 *
 * @prop pageHasPlayerControls
 *   Set to true if player controls are present on the page. This can
 *   be used by themes to apply different styles to the background.
 *
 * @alias pageflow.react.components.PageBackground
 * @class
 * @since 0.1
 */
export default function PageBackground(props) {
  return (
    <div className={className(props)}>
      {props.children}
    </div>
  );
}

PageBackground.propTypes = {
  pageHasPlayerControls: React.PropTypes.bool
};

function className({pageHasPlayerControls}) {
  return classNames('page_background', {
    'page_background-for_page_with_player_controls': pageHasPlayerControls
  });
}
