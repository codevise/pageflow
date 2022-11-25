import React from 'react';

import {renderElement} from '../../EditableText';
import {LinkPreview} from './LinkTooltip';

export function withLinks(editor) {
  const { isInline } = editor

  editor.isInline = element => {
    return element.type === 'link' ? true : isInline(element)
  }

  return editor
}

export function renderElementWithLinkPreview(options) {
  if (options.element.type === 'link') {
    return (
      <LinkPreview href={options.element.href}>
        {renderElement(options)}
      </LinkPreview>
    )
  }
  else {
    return renderElement(options);
  }
}
