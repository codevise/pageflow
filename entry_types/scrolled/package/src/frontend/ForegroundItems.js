import React from 'react';

import ForegroundItem from './ForegroundItem';

export default function ForegroundItems(props) {
  return (
    <>
      {props.items.map((item, index) =>
        props.children(item,
                        <ForegroundItem key={index}
                                        type={item.type}
                                        position={item.position}
                                        availablePositions={props.availablePositions}
                                        onPositionChange={position => props.onPositionChange(item.index, position)}
                                        itemProps={item.props} />)
       )}
    </>
  );
}

ForegroundItems.defaultProps = {
  children: (item, child) => child
};
