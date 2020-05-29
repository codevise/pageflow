import React from 'react';
import {Text, Range} from 'slate';

import {renderElement, renderLeaf} from '../../EditableText';
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

export function renderLeafWithLinkSelection(options) {
  if (options.leaf.linkSelection) {
    return (
      <span {...options.attributes}
            style={{backgroundColor: '#aaa'}}>
        {renderLeaf(options)}
      </span>
    );
  }

  return renderLeaf(options);
}

export function decorateLinkSelection([node, path], linkSelection) {
  if (linkSelection && Text.isText(node)) {
    const nodeRange = {
      anchor: {path, offset: 0},
      focus: {path, offset: node.text.length}
    };
    const intersection = Range.intersection(nodeRange, linkSelection);

    if (intersection) {
      return [{
        ...intersection,
        linkSelection: true
      }];
    }
  }

  return [];
}
