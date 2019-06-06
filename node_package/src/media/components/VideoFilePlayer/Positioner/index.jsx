import getDimensions from './getDimensions';
import getCueOffsetClassName from './getCueOffsetClassName';

import React from 'react';
import Measure from 'react-measure';

export default function Positioner(props) {
  return (
    <Measure whitelist={['width', 'height']} cloneOptions={{noCloneOnZeroDimension: true}}>
      {wrapperDimensions => renderWrapper(props, wrapperDimensions)}
    </Measure>
  );
}

Positioner.propTypes = {
  videoFile: React.PropTypes.object,
  fit: React.PropTypes.oneOf(['contain', 'cover', 'smart_contain']),
  position: React.PropTypes.arrayOf(React.PropTypes.number)
};

function renderWrapper(props, wrapperDimensions) {
  const dimensions = getDimensions(props.videoFile,
                                   props.fit,
                                   props.position,
                                   wrapperDimensions);
  return (
    <div className="uncropped_media_wrapper">
      <div className={getCueOffsetClassName(dimensions, wrapperDimensions)}
           style={style(dimensions)}>
        {props.children}
      </div>
    </div>
  );
}

function style(dimensions) {
  return dimensions && {
    position: 'absolute',
    ...dimensions
  };
}
