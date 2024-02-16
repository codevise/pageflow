import React from 'react';
import classNames from 'classnames';

import {camelize} from './utils/camelize';
import {paletteColor} from './paletteColor';
import {withInlineEditingAlternative} from './inlineEditing';
import {useChapter, useFile} from '../entryState';
import {useDarkBackground} from './backgroundColor';
import {Text} from './Text';
import textStyles from './Text.module.css';

import styles from './EditableText.module.css';

const defaultValue = [{
  type: 'paragraph',
  children: [{ text: '' }],
}];

export const EditableText = withInlineEditingAlternative('EditableText', function EditableText({
  value, className, scaleCategory = 'body'
}) {
  return (
    <div className={classNames(styles.root, className)}>
      <Text scaleCategory={scaleCategory}>
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

  const styles = element.color &&
                 {color: paletteColor(element.color)};

  switch (element.type) {
  case 'block-quote':
    return (
      <blockquote {...attributes}
                  className={variantClassName}
                  style={styles}>
        {children}
      </blockquote>
    );
  case 'bulleted-list':
    return (
      <ul {...attributes}
          className={variantClassName}
          style={styles}>
        {children}
      </ul>
    );
  case 'numbered-list':
    return (
      <ol {...attributes}
          className={variantClassName}
          style={styles}>
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
               variantClassName={variantClassName}
               styles={styles}>
        {children}
      </Heading>
    );
  case 'link':
    return renderLink({attributes, children, element});
  default:
    return (
      <p {...attributes}
         className={variantClassName}
         style={styles}>
        {children}
      </p>
    );
  }
}

function Heading({attributes, variantClassName, styles: inlineStyles, children}) {
  const darkBackground = useDarkBackground();

  return (
    <h2 {...attributes}
        className={classNames(variantClassName,
                              darkBackground ? styles.light : styles.dark,
                              'scope-headings',
                              textStyles['heading-xs'])}
        style={inlineStyles}>
      {children}
    </h2>
  );
}

function renderLink({attributes, children, element}) {
  if (element?.href?.chapter) {
    const {key, ...otherAttributes} = attributes;

    return (
      <ChapterLink key={key}
                   attributes={otherAttributes}
                   chapterPermaId={element.href.chapter}>
        {children}
      </ChapterLink>
    );
  }
  else if (element?.href?.section) {
    return <a {...attributes}
              className={styles.link}
              href={`#section-${element.href.section}`}>
      {children}
    </a>;
  }
  if (element?.href?.file) {
    const {key, ...otherAttributes} = attributes;

    return (
      <FileLink key={key}
                attributes={otherAttributes}
                fileOptions={element.href.file}>
        {children}
      </FileLink>
    );
  }
  else {
    const targetAttributes = element.openInNewTab ?
                             {target: '_blank', rel: 'noopener noreferrer'} :
                             {};

    return <a {...attributes}
              {...targetAttributes}
              className={styles.link}
              href={element.href}>
      {children}
    </a>;
  }
}

function ChapterLink({attributes, children, chapterPermaId}) {
  const chapter = useChapter({permaId: chapterPermaId});

  return <a {...attributes}
            className={styles.link}
            href={`#${chapter?.chapterSlug || ''}`}>
    {children}
  </a>;
}

function FileLink({attributes, children, fileOptions}) {
  const file = useFile(fileOptions);

  return <a {...attributes}
            className={styles.link}
            target="_blank"
            rel="noopener noreferrer"
            href={file?.urls.original || '#'}>
    {children}
  </a>;
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
