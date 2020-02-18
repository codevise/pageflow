import React from 'react';
import PropTypes from 'prop-types';

import {Text} from './Text';
import styles from './InlineCaption.module.css';

/**
 * Render a caption text attached to a content element.
 *
 * @param {Object} props
 * @param {string} props.text - The text to be displayed.
 */
export function InlineCaption({text}) {
  if (text) {
    return (
      <div className={styles.root} role="caption">
        <Text scaleCategory="caption">
          {text}
        </Text>
      </div>
    );
  }
  else {
    return null;
  }
}

InlineCaption.propTypes = {
  text: PropTypes.string
}
