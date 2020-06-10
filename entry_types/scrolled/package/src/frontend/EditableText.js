import React from 'react';

import {withInlineEditingAlternative} from './inlineEditing';
import {Text} from './Text';

export const EditableText = withInlineEditingAlternative('EditableText', function EditableText({value}) {
  return (
    <Text scaleCategory="body">
      {render(value)}
    </Text>
  );
});

function render(children = []) {
  return children.map((element, index) => {
    if (element.type) {
      return renderElement({attributes: {key: index}, element, children: render(element.children)});
    }
    else {
      return renderLeaf({
        attributes: {key: index},
        leaf: element,
        children: element.text.trim() === '' ? '\uFEFF' : element.text
      });
    }
  });
}

export function renderElement({attributes, children, element}) {
  switch (element.type) {
  case 'block-quote':
    return <blockquote {...attributes}>{children}</blockquote>;
  case 'bulleted-list':
    return <ul {...attributes}>{children}</ul>;
  case 'numbered-list':
    return <ol {...attributes}>{children}</ol>;
  case 'list-item':
    return <li {...attributes}>{children}</li>;
  case 'heading':
    return <h2 {...attributes}>{children}</h2>;
  case 'link':
    return <a {...attributes} href={element.href}>{children}</a>;
  default:
    return <p {...attributes}>{children}</p>;
  }
}

export function renderLeaf({attributes, children, leaf}) {
  if (leaf.bold) {
    children = <strong>{children}</strong>
  }

  if (leaf.italic) {
    children = <em>{children}</em>
  }

  if (leaf.underline) {
    children = <u>{children}</u>
  }

  if (leaf.strikethrough) {
    children = <s>{children}</s>
  }

  return <span {...attributes}>{children}</span>
}
