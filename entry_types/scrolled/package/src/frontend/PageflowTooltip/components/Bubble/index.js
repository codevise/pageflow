/** @jsx jsx */
import PropTypes from "prop-types"
import {css, jsx} from "@emotion/core"

import styles from './Bubble.module.css';

let bubbleInlineStyle = (props) => {
  let style = {};
  if (props.placement === 'top') {
    style.borderTop = '3px solid #e10028';
  }
  else{
    style.borderBottom = '3px solid #e10028';
  }

  return style;
}

const Bubble = props => (
  <div
    style={bubbleInlineStyle(props)}
    className={styles.base}
    css={css`
      color: ${props.color ? props.color : "inherit"};
      background: ${props.background ? props.background : "inherit"};
      border-radius: ${props.radius ? `${props.radius}px` : 0};
      border: 1px solid ${props.border};
      box-shadow: 0 0 0.3125rem 2px rgba(0,0,0,.3);
      padding: ${props.padding ? `${props.padding}px` : 0};
      font-size: ${props.fontSize};
      font-family: ${props.fontFamily};
    `}
  >
    {props.children}
  </div>
)

Bubble.propTypes = {
  color: PropTypes.string,
  background: PropTypes.string,
  border: PropTypes.string,
  padding: PropTypes.number,
  radius: PropTypes.number,
  fontSize: PropTypes.string,
  fontFamily: PropTypes.string,
  children: PropTypes.array,
  placement: PropTypes.string,
}

export default Bubble
