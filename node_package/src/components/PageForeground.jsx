import React from 'react';

/**
 * Use inside {@link
 * pageflow.react.components.PageWrapper|PageWrapper}  to build the
 * default page structure.
 *
 * @alias pageflow.react.components.PageForeground
 * @class
 * @since 12.1
 */
export default function(props) {
  return (
    <div className="content" onTouchStart={props.onInteraction} onMouseMove={props.onInteraction}>
      {props.children}
    </div>
  );
}
