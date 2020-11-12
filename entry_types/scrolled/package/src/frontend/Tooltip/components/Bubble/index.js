import React from 'react';
import PropTypes from "prop-types"
import styles from './Bubble.module.css';

let bubbleInlineStyle = (props) => {
  let style = {};
  style.color = props.color ? props.color : undefined;
  style.background = props.background ? props.background : undefined;
  style.borderRadius = props.radius ? props.radius+'px' : undefined;
  style.border = '1px solid '+props.border;
  style.padding = props.padding ? props.padding + 'px' : undefined;
  style.fontSize = props.fontSize;
  style.fontFamily = props.fontFamily;
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
    className={styles.base} >
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
