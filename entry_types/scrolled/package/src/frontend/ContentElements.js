import React from 'react';

import {ContentElement, arePropsEqual} from './ContentElement';
import {ContentElementScrollSpace} from './ContentElementScrollSpace';

export function ContentElements(props) {
  return (
    <>
      {props.items.map((item, index) =>
        props.children(
          item,
          renderScrollSpace(
            item,
            <MemoizedContentElement key={item.id}
                                    id={item.id}
                                    permaId={item.permaId}
                                    type={item.type}
                                    first={index === 0}
                                    position={item.position}
                                    width={item.width}
                                    itemProps={item.props}
                                    customMargin={props.customMargin}
                                    sectionProps={props.sectionProps} />
          ),
          index
        )
      )}
    </>
  );
}

const MemoizedContentElement = React.memo(ContentElement, arePropsEqual);

ContentElements.defaultProps = {
  children: (item, child) => child
};

function renderScrollSpace(item, children) {
  if (!item.standAlone) {
    return children;
  }

  return (
    <ContentElementScrollSpace key={item.id}
                               children={children} />
  );
}
