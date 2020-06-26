import React from 'react';

import {ContentElement} from './ContentElement';

export function ContentElements(props) {
  return (
    <>
      {props.items.map((item, index) =>
        props.children(item,
                       <ContentElement key={item.id}
                                       id={item.id}
                                       permaId={item.permaId}
                                       type={item.type}
                                       first={index === 0}
                                       position={item.position}
                                       itemProps={item.props}
                                       sectionProps={props.sectionProps} />,
                       index)
       )}
    </>
  );
}

ContentElements.defaultProps = {
  children: (item, child) => child
};
