import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import styles from './Text.module.css';

/**
 * Render some text using the default typography scale.
 *
 * @param {Object} props
 * @param {string} props.scaleCategory -
 *   One of the styles `'heading-lg'`, `'heading-md'`, `'heading-sm'`,`'heading-xs'`,
 *   `'headingTagline-lg'`, `'headingTagline-md'`, `'headingTagline-sm'`,
 *   `'headingSubtitle-lg'`, `'headingSubtitle-md'`, `'headingSubtitle-sm'`,
 *   `'body'`, `'caption'`, `'question'`,
 *   `'quoteText-lg'`, `'quoteText-md'`, `'quoteText-sm'`, `'quoteText-xs'`, `'quoteAttribution'`,
 *   `'counterNumber-lg'`, `'counterNumber-md'`, `'counterNumber-sm'`,
 *   `'counterNumber-xs'`, `'counterDescription`'.
 *   `'infoTableLabel'`, `'infoTableValue`'.
 *   `'hotspotsTooltipTitle'`, `'hotspotsTooltipDescription`', `'hotspotsTooltipLink`'
 * @param {string} [props.typographyVariant] - Suffix for variant class name.
 * @param {string} [props.inline] - Render a span instread of a div.
 * @param {string} props.children - Nodes to render with specified typography.
 */
export function Text({inline, scaleCategory, typographyVariant, children}) {
  const variantClassName =
    typographyVariant &&
    `typography-${scaleCategory.split('-')[0]}-${typographyVariant}`;

  return React.createElement(inline ? 'span' : 'div',
                             {className: classNames(styles[scaleCategory],
                                                    variantClassName)},
                             children);
}

Text.propTypes = {
  children: PropTypes.node.isRequired,
  inline: PropTypes.bool,
  scaleCategory: PropTypes.oneOf([
    'heading-lg', 'heading-md', 'heading-sm', 'heading-xs',
    'headingTagline-lg', 'headingTagline-md', 'headingTagline-sm',
    'headingSubtitle-lg', 'headingSubtitle-md', 'headingSubtitle-sm',
    'quoteText-lg', 'quoteText-md', 'quoteText-sm', 'quoteText-xs',
    'quoteAttribution-lg', 'quoteAttribution-md', 'quoteAttribution-sm', 'quoteAttribution-xs',
    'hotspotsTooltipTitle', 'hotspotsTooltipDescription', 'hotspotsTooltipLink',
    'counterNumber-lg', 'counterNumber-md', 'counterNumber-sm', 'counterNumber-xs',
    'counterDescription',
    'infoTableLabel', 'infoTableValue',
    'body', 'caption', 'question'
  ]),
}
