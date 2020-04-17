import React from 'react';

import mapping from './icons/mapping';

/**
 * Render an SVG icon from {@link pageflow.react.iconMapping}.
 *
 * @alias pageflow.react.components.Icon
 * @class
 * @since 12.1
 *
 * @prop name
 *   Required. The key to look up in the mapping.
 */
export default function Icon(props) {
  const SvgIcon = mapping[props.name];

  if (!SvgIcon) {
    throw new Error(`No icon registered for "${props.name}".`);
  }

  return (
    <SvgIcon {...props} />
  );
}

Icon.propTypes = {
  name: React.PropTypes.string.isRequired
};
