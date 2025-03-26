import React from 'react';
import classNames from 'classnames';

import {camelize} from './utils/camelize';
import {paletteColor} from './paletteColor';
import {withInlineEditingAlternative} from './inlineEditing';
import {useDarkBackground} from './backgroundColor';
import {Text} from './Text';
import {Link} from './Link';

import styles from './EditableText.module.css';
import textStyles from './Text.module.css';

const defaultValue = [{
  type: 'paragraph',
  children: [{ text: '' }],
}];

export const EditableText = withInlineEditingAlternative('EditableText', function EditableText({
  value, className, scaleCategory = 'body', typographyVariant, typographySize
}) {
  return (
    <div className={classNames(styles.root, className)}>
      <Text scaleCategory={scaleCategory} typographyVariant={typographyVariant} typographySize={typographySize}>
        {render(value || defaultValue)}
      </Text>
    </div>
  );
});

function render(children) {
  return children.map((element, index) => {
    if (element.type) {
      return renderElement({attributes: {key: index}, element, children: render(element.children)});
    }
    else {
      return renderLeaf({
        attributes: {key: index},
        leaf: element,
        children: children.length === 1 &&
                  element.text.trim() === '' ? '\uFEFF' : element.text
      });
    }
  });
}

export function renderElement({attributes, children, element}) {
  const variantClassName = element.variant &&
                           ['typography-textBlock',
                            camelize(element.type),
                            element.variant].join('-');

  const sizeClassName = element.size &&
                        ['typography-textBlock',
                         camelize(element.type),
                         element.size].join('-');

  const className = classNames(
    variantClassName,
    sizeClassName,
    {[styles.justify]: element.textAlign === 'justify'}
  );

  const inlineStyles = {
    ...(element.color && {color: paletteColor(element.color)})
  };

  switch (element.type) {
  case 'block-quote':
    return (
      <blockquote {...attributes}
                  className={className}
                  style={inlineStyles}>
        {children}
      </blockquote>
    );
  case 'bulleted-list':
    return (
      <ul {...attributes}
          className={className}
          style={inlineStyles}>
        {children}
      </ul>
    );
  case 'numbered-list':
    return (
      <ol {...attributes}
          className={className}
          style={inlineStyles}>
        {children}
      </ol>
    );
  case 'list-item':
    return <li {...attributes}>{children}</li>;
  case 'heading':
    const {key, ...otherAttributes} = attributes;

    return (
      <Heading key={key}
               attributes={otherAttributes}
               className={className}
               inlineStyles={inlineStyles}>
        {children}
      </Heading>
    );
  case 'link':
    return renderLink({attributes, children, element});
  default:
    return (
      <p {...attributes}
         className={className}
         style={inlineStyles}>
        {children}
      </p>
    );
  }
}

function Heading({attributes, className, inlineStyles, children}) {
  const darkBackground = useDarkBackground();

  return (
    <h2 {...attributes}
        className={classNames(className,
                              darkBackground ? styles.light : styles.dark,
                              'scope-headings',
                              textStyles['heading-xs'])}
        style={inlineStyles}>
      {children}
    </h2>
  );
}

export function renderLink({attributes, children, element}) {
  const {key, ...otherAttributes} = attributes;

  return (
    <Link key={key}
          attributes={{...otherAttributes, className: styles.link}}
          href={element.href}
          openInNewTab={element.openInNewTab}
          children={children} />
  );
}

export function renderLeaf({attributes, children, leaf}) {
  if (leaf.bold) {
    children = <strong className={styles.bold}>{children}</strong>
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

  if (leaf.sub) {
    children = <sub>{children}</sub>
  }

  if (leaf.sup) {
    children = <sup>{children}</sup>
  }

  return <span {...attributes}>{children}</span>
}
