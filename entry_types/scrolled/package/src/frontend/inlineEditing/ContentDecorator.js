import React from 'react';
import {DndProvider} from 'react-dnd';
import {HTML5Backend} from 'react-dnd-html5-backend';

import {ScrollPointMessageHandler} from './scrollPoints';

export function ContentDecorator(props) {
  return (
    <>
      <ScrollPointMessageHandler />
      <DndProvider backend={HTML5Backend}>
        {props.children}
      </DndProvider>
    </>
  );
}
