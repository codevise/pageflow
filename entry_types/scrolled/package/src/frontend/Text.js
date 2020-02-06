import React from 'react';
import PropTypes from 'prop-types';

import styles from './Text.module.css';

/**
 * Render some text using the default typography scale.
 *
 * @param {Object} props
 * @param {string} props.scaleCategory - One of the styles `'h1'`, `'h2'`, `'body'`, `'caption'`.
 * @param {string} [props.inline] - Render a span instread of a div.
 * @param {string} props.children - Nodes to render with specified typography.
 */
export function Text({inline, scaleCategory, children}) {
  return React.createElement(inline ? 'span' : 'div',
                             {className: styles[scaleCategory]},
                             children);
}

Text.propTypes = {
  children: PropTypes.node.isRequired,
  inline: PropTypes.bool,
  scaleCategory: PropTypes.oneOf(['h1', 'h2', 'body', 'caption']),
}
