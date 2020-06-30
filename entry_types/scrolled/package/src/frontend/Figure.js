import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import {Text} from './Text';
import {useDarkBackground} from './backgroundColor';

import styles from './Figure.module.css';

/**
 * Render a figure with a caption text attached.
 *
 * @param {Object} props
 * @param {string} props.children - Content of figure.
 * @param {string} props.text - The text to be displayed.
 */
export function Figure({children, caption}) {
  const darkBackground = useDarkBackground();

  if (caption) {
    return (
      <figure className={classNames(styles.root, {[styles.invert]: !darkBackground})}>
        {children}
        <figcaption>
          <Text scaleCategory="caption">
            {caption}
          </Text>
        </figcaption>
      </figure>
    );
  }
  else {
    return children;
  }
}

Figure.propTypes = {
  caption: PropTypes.string,
  children: PropTypes.node
}
