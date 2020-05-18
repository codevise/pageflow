import React, {useEffect, useRef} from 'react';
import {Editor, Transforms, Range, Path, Node} from 'slate';
import {useSlate, ReactEditor} from 'slate-react';

import styles from './index.module.css';

import {SelectionRect} from '../SelectionRect';
import {useEditorSelection} from '../../EditorState';
import {postInsertContentElementMessage} from '../postMessage';

import TextIcon from '../images/text.svg';
import HeadingIcon from '../images/heading.svg';
import OlIcon from '../images/listOl.svg';
import UlIcon from '../images/listUl.svg';
import QuoteIcon from '../images/quote.svg';

export function Selection(props) {
  const editor = useSlate();

  const ref = useRef()
  const outerRef = useRef()
  const innerRef = useRef()

  const boundsRef = useRef({});

  const {select, isSelected: isContentElementSelected} = useEditorSelection(
    {id: props.contentElementId, type: 'contentElement'}
  );

  useEffect(() => {
    const {selection} = editor;

    if (!ref.current) {
      return
    }

    if (!selection) {
      hideRect(ref.current);
      return;
    }

    if (!isContentElementSelected) {
      select();
    }

    const [start, end] = computeBounds();

    boundsRef.current.start = start;
    boundsRef.current.end = end;

    updateRect(editor, start, end, outerRef.current, ref.current, innerRef.current);
  });

  return (
    <div ref={outerRef}>
      <div ref={ref} className={styles.selection}>
        <SelectionRect selected={true}
                       onInsertButtonClick={position => {
                           if (boundsRef.current.start === 0 &&
                               position === 'before') {
                             postInsertContentElementMessage({
                               id: props.contentElementId,
                               position: 'before'
                             });
                           }
                           else if (position === 'after' &&
                                    !Node.has(editor, [boundsRef.current.end + 1])) {
                             postInsertContentElementMessage({
                               id: props.contentElementId,
                               position: 'after'
                             });
                           }
                           else {
                             postInsertContentElementMessage({
                               id: props.contentElementId,
                               position: 'split',
                               at: position === 'before' ?
                                   boundsRef.current.start :
                                   boundsRef.current.end + 1
                             });
                           }
                         }}
                       toolbarButtons={toolbarButtons.map(button => ({
                           ...button,
                           active: isBlockActive(editor, button.name)
                         }))}
                       onToolbarButtonClick={name => toggleBlock(editor, name)}>
          <div ref={innerRef} />
        </SelectionRect>
      </div>
    </div>
  );
}

function computeBounds(editor) {
  const domSelection = window.getSelection();
  const domRange = domSelection.getRangeAt(0);

  const range = ReactEditor.toSlateRange(editor, domRange);

  const startPoint = Range.start(range);
  const endPoint = Range.end(range);

  const startPath = startPoint.path.slice(0, 1);
  let endPath = endPoint.path.slice(0, 1);

  if (!Path.equals(startPath, endPath) && endPoint.offset === 0) {
    endPath = Path.previous(endPath);
  }

  return [startPath[0], endPath[0]];
}

function hideRect(el) {
  el.removeAttribute('style');
}

function updateRect(editor, startIndex, endIndex, outer, el, inner) {
  const startNode = Node.get(editor, [startIndex]);
  const endNode = Node.get(editor, [endIndex]);

  const startDOMNode = ReactEditor.toDOMNode(editor, startNode);
  const endDOMNode = ReactEditor.toDOMNode(editor, endNode);

  const startRect = startDOMNode.getBoundingClientRect()
  const endRect = endDOMNode.getBoundingClientRect()
  const outerRect = outer.getBoundingClientRect()

  el.style.display = 'block';
  el.style.top = `${startRect.top - outerRect.top}px`
  inner.style.height = `${endRect.bottom - startRect.top}px`
}

const listTypes = ['numbered-list', 'bulleted-list'];

function toggleBlock(editor, format) {
  const isActive = isBlockActive(editor, format)
  const isList = listTypes.includes(format)

  Transforms.unwrapNodes(editor, {
    match: n => listTypes.includes(n.type),
    split: true,
  })

  Transforms.setNodes(editor, {
    type: isActive ? 'paragraph' : isList ? 'list-item' : format,
  })

  if (!isActive && isList) {
    const block = { type: format, children: [] }
    Transforms.wrapNodes(editor, block)
  }
}

function isBlockActive(editor, format) {
  const [match] = Editor.nodes(editor, {
    match: n => n.type === format,
  })

  return !!match
}

const toolbarButtons = [
  {
    name: 'paragraph',
    text: 'Paragraph',
    icon: TextIcon
  },
  {
    name: 'heading',
    text: 'Heading',
    icon: HeadingIcon
  },
  {
    name: 'numbered-list',
    text: 'Ordered List',
    icon: OlIcon
  },
  {
    name: 'bulleted-list',
    text: 'Bullet Points',
    icon: UlIcon
  },
  {
    name: 'block-quote',
    text: 'Block quit',
    icon: QuoteIcon
  }
];
