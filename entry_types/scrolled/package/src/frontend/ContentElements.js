import React from 'react';

import {ContentElement} from './ContentElement';
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

const MemoizedContentElement = React.memo(
  ContentElement,
  (prevProps, nextProps) => (
    prevProps.id === nextProps.id &&
    prevProps.permaId === nextProps.permaId &&
    prevProps.type === nextProps.type &&
    prevProps.position === nextProps.position &&
    prevProps.width === nextProps.width &&
    prevProps.itemProps === nextProps.itemProps &&
    prevProps.customMargin === nextProps.customMargin &&
    prevProps.sectionProps === nextProps.sectionProps
  )
);

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
