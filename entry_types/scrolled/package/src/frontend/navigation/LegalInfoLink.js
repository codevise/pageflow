import React from 'react';

export function LegalInfoLink(props) {
  return (
    <div>
      {props.label && props.url &&
      <a target="_blank" href={props.url}
         dangerouslySetInnerHTML={{__html: props.label}}>
      </a>
      }
    </div>
  )
}
