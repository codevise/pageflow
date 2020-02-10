import React from 'react';

import {ContentElement} from './ContentElement';

export function ContentElements(props) {
  return (
    <>
      {props.items.map((item, index) =>
        props.children(item,
                       <ContentElement key={index}
                                       type={item.type}
                                       position={item.position}
                                       itemProps={item.props} />)
       )}
    </>
  );
}

ContentElements.defaultProps = {
  children: (item, child) => child
};
