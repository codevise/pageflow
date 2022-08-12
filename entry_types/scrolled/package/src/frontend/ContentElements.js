import React from 'react';

import {ContentElement} from './ContentElement';

export function ContentElements(props) {
  return (
    <>
      {props.items.map((item, index) =>
        props.children(item,
                       <MemoizedContentElement key={item.id}
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

const MemoizedContentElement = React.memo(
  ContentElement,
  (prevProps, nextProps) => (
    prevProps.id === nextProps.id &&
    prevProps.permaId === nextProps.permaId &&
    prevProps.type === nextProps.type &&
    prevProps.position === nextProps.position &&
    prevProps.itemProps === nextProps.itemProps &&
    prevProps.sectionProps === nextProps.sectionProps
  )
);

ContentElements.defaultProps = {
  children: (item, child) => child
};
