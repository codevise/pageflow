import React, {useEffect, useRef} from 'react';
import {Editor, Transforms, Range, Path, Node} from 'slate';
import {useSlate, ReactEditor} from 'slate-react';

import styles from './index.module.css';

import {SelectionRect} from '../SelectionRect';
import {useContentElementEditorState} from '../../useContentElementEditorState';
import {useI18n} from '../../i18n';
import {postInsertContentElementMessage} from '../postMessage';

import TextIcon from '../images/text.svg';
import HeadingIcon from '../images/heading.svg';
import OlIcon from '../images/listOl.svg';
import UlIcon from '../images/listUl.svg';
import QuoteIcon from '../images/quote.svg';

export function Selection(props) {
  const editor = useSlate();
  const {t} = useI18n({locale: 'ui'});

  const ref = useRef()
  const outerRef = useRef()
  const innerRef = useRef()

  const boundsRef = useRef();

  const {
    setTransientState,
    select,
    isSelected: isContentElementSelected
  } = useContentElementEditorState();

  useEffect(() => {
    const {selection} = editor;

    if (!ref.current) {
      return
    }

    if (!selection) {
      if (boundsRef.current) {
        hideRect(ref.current);
        boundsRef.current = null;
      }

      return;
    }

    if (!isContentElementSelected && boundsRef.current) {
      hideRect(ref.current);
      return;
    }

    if (!isContentElementSelected && !boundsRef.current) {
      select();
    }

    const [start, end] = computeBounds(editor);

    setTransientState({
      editableTextIsSingleBlock: editor.children.length <= 1
    });

    boundsRef.current = {start, end};
    updateRect(editor, start, end, outerRef.current, ref.current, innerRef.current);
  });

  return (
    <div ref={outerRef}>
      <div ref={ref} className={styles.selection}>
        <SelectionRect selected={true}
                       insertButtonTitles={t('pageflow_scrolled.inline_editing.insert_content_element')}
                       onInsertButtonClick={at => {
                           if ((at === 'before' &&boundsRef.current.start === 0) ||
                               (at === 'after' && !Node.has(editor, [boundsRef.current.end + 1]))) {
                             postInsertContentElementMessage({
                               id: props.contentElementId,
                               at
                             });
                           }
                           else {
                             postInsertContentElementMessage({
                               id: props.contentElementId,
                               at: 'split',
                               splitPoint: at === 'before' ?
                                           boundsRef.current.start :
                                           boundsRef.current.end + 1
                             });
                           }
                         }}
                       toolbarButtons={toolbarButtons(t).map(button => ({
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
  const startPoint = Range.start(editor.selection);
  const endPoint = Range.end(editor.selection);

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
  const [startDOMNode, endDOMNode] = getDOMNodes(editor, startIndex, endIndex);

  if (startDOMNode && endDOMNode) {
    const startRect = startDOMNode.getBoundingClientRect()
    const endRect = endDOMNode.getBoundingClientRect()
    const outerRect = outer.getBoundingClientRect()

    el.style.display = 'block';
    el.style.top = `${startRect.top - outerRect.top}px`
    inner.style.height = `${endRect.bottom - startRect.top}px`
  }
}

function getDOMNodes(editor, startIndex, endIndex) {
  const startNode = Node.get(editor, [startIndex]);
  const endNode = Node.get(editor, [endIndex]);

  try {
    const startDOMNode = ReactEditor.toDOMNode(editor, startNode);
    const endDOMNode = ReactEditor.toDOMNode(editor, endNode);

    return [startDOMNode, endDOMNode];
  }
  catch(e) {
    return [];
  }
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

function toolbarButtons(t) {
  return [
    {
      name: 'paragraph',
      text: t('pageflow_scrolled.inline_editing.formats.paragraph'),
      icon: TextIcon
    },
    {
      name: 'heading',
      text: t('pageflow_scrolled.inline_editing.formats.heading'),
      icon: HeadingIcon
    },
    {
      name: 'numbered-list',
      text: t('pageflow_scrolled.inline_editing.formats.ordered_list'),
      icon: OlIcon
    },
    {
      name: 'bulleted-list',
      text: t('pageflow_scrolled.inline_editing.formats.bulleted_list'),
      icon: UlIcon
    },
    {
      name: 'block-quote',
      text: t('pageflow_scrolled.inline_editing.formats.block_quote'),
      icon: QuoteIcon
    }
  ];
}
