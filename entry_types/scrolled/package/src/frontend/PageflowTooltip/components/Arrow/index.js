/** @jsx jsx */
import PropTypes from "prop-types"
import {jsx} from "@emotion/core"
import classNames from 'classnames';

import styles from './Arrow.module.css';

const BaseArrow = ({type, ...props}) => {
  let  style = {borderColor: props.border, background: props.background, width: props.width}
  if (type === 'right' || type === 'left') {
    style.top = props.arrowPos;
  }
  else{
    style.left = props.arrowPos;
  }
  return (<div style={style} className={classNames(styles.base, styles[type])} />)
}

BaseArrow.propTypes = {
  type: PropTypes.string.isRequired,
  background: PropTypes.string.isRequired,
  border: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
}

const arrows = {
  left: props => BaseArrow({type: 'right', ...props}),
  top: props => BaseArrow({type: 'down', ...props}),
  right: props => BaseArrow({type: 'left', ...props}),
  bottom: props => BaseArrow({type: 'up', ...props}),
}

const Arrow = ({background, border, placement, arrowPos, width}) => {
  const Component = arrows[placement] || arrows.top
  return (
    width > 0 && (
      <Component background={background} border={border} arrowPos={arrowPos} width={width} />
    )
  )
}

Arrow.propTypes = {
  background: PropTypes.string.isRequired,
  border: PropTypes.string.isRequired,
  placement: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  arrowPos: PropTypes.string,
}

export default Arrow
