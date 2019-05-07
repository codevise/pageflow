import React from 'react';
import classNames from 'classnames';

/**
 * @desc Place inside
 * {@link pageflow.react.components.PageScroller|PageScroller} to
 * display the page's content text.
 *
 * @alias pageflow.react.components.PageText
 * @class
 * @since 0.1
 *
 * @prop page
 *   Required. The page object to read configuration properties from.
 */
export default function PageText(props) {
  return (
    <div className={className(props)}>
      <div className='paragraph' dangerouslySetInnerHTML={text(props)} />
      {props.children}
    </div>
  );
}

PageText.defaultProps = {
  marginBottom: 'for_scroll_indicator_on_phone'
};

PageText.propTypes = {
  marginBottom: React.PropTypes.oneOf([
    'for_player_controls', 'for_scroll_indicator_on_phone', 'none'
  ])
};

function className(props) {
  return classNames('page_text', {
    [`page_text-margin_${props.marginBottom}`]: props.marginBottom != PageText.defaultProps.marginBottom
  });
}

function text(props) {
  return {__html: props.page.text};
}
