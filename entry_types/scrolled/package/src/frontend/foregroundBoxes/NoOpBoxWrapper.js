import React from 'react';

export default function NoOpBoxWrapper(props) {
  return(
    <div>
      {props.children}
    </div>
  )
}