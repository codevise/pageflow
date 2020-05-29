import React, {useRef, useEffect} from 'react';
import {Editor, Range} from 'slate';
import {ReactEditor, useSlate} from 'slate-react';

import {Toolbar} from '../Toolbar';

import styles from './index.module.css';

import BoldIcon from '../images/bold.svg';
import UnderlineIcon from '../images/underline.svg';
import ItalicIcon from '../images/italic.svg';
import StrikethroughIcon from '../images/strikethrough.svg';

export function HoveringToolbar() {
  const ref = useRef()
  const outerRef = useRef()
  const editor = useSlate()

  useEffect(() => {
    const el = ref.current
    const {selection} = editor

    if (!el || !outerRef.current) {
      return
    }

    if (
      !selection ||
      !ReactEditor.isFocused(editor) ||
      Range.isCollapsed(selection) ||
      Editor.string(editor, selection) === ''
    ) {
      el.removeAttribute('style')
      return
    }

    const domRange = ReactEditor.toDOMRange(editor, editor.selection);
    const rect = domRange.getBoundingClientRect()
    const outerRect = outerRef.current.getBoundingClientRect()

    el.style.opacity = 1
    el.style.top = `${rect.bottom - outerRect.top + 10}px`
    el.style.left = `${rect.left - outerRect.left}px`
  })

  const buttons = [
    {
      name: 'bold',
      text: 'Bold',
      icon: BoldIcon
    },
    {
      name: 'italic',
      text: 'Italic',
      icon: ItalicIcon
    },
    {
      name: 'underline',
      text: 'Underline',
      icon: UnderlineIcon
    },
    {
      name: 'strikethrough',
      text: 'Strikethrough',
      icon: StrikethroughIcon
    },
  ].map(button => ({...button, active: isMarkActive(editor, button.name)}));

  return (
    <div ref={outerRef}>
      <div ref={ref} className={styles.hoveringToolbar}>
        <Toolbar buttons={buttons}
                 onButtonClick={name => toggleMark(editor, name)}/>
      </div>
    </div>
  );
}

function toggleMark(editor, format) {
  const isActive = isMarkActive(editor, format)

  if (isActive) {
    Editor.removeMark(editor, format)
  } else {
    Editor.addMark(editor, format, true)
  }
}

function isMarkActive(editor, format) {
  const marks = Editor.marks(editor)
  return marks ? marks[format] === true : false
}
