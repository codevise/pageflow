import React from 'react';

export function LegalInfoLink(props) {
  return (
    <div>
      {props.label && props.url &&
      <a target="_blank" href={props.url}>
        {props.label}
      </a>
      }
    </div>
  )
}
