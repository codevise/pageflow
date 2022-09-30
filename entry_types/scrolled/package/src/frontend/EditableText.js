import React from 'react';
import classNames from 'classnames';

import {camelize} from './utils/camelize';
import {withInlineEditingAlternative} from './inlineEditing';
import {Text} from './Text';
import textStyles from './Text.module.css';

import styles from './EditableText.module.css';

export const EditableText = withInlineEditingAlternative('EditableText', function EditableText({value}) {
  return (
    <div className={styles.root}>
      <Text scaleCategory="body">
        {render(value)}
      </Text>
    </div>
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
  const variantClassName = element.variant &&
                           ['typography-textBlock',
                            camelize(element.type),
                            element.variant].join('-');

  switch (element.type) {
  case 'block-quote':
    return (
      <blockquote {...attributes} className={variantClassName}>
        {children}
      </blockquote>
    );
  case 'bulleted-list':
    return <ul {...attributes} className={variantClassName}>{children}</ul>;
  case 'numbered-list':
    return <ol {...attributes} className={variantClassName}>{children}</ol>;
  case 'list-item':
    return <li {...attributes}>{children}</li>;
  case 'heading':
    return (
      <h2 {...attributes}
          className={classNames(variantClassName, textStyles['heading-xs'])}>
        {children}
      </h2>
    );
  case 'link':
    return <a {...attributes} href={element.href}>{children}</a>;
  default:
    return <p {...attributes} className={variantClassName}>{children}</p>;
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
