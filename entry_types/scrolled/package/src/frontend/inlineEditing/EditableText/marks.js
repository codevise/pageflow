import {Editor} from 'slate';

const mutuallyExclusive = {
  sup: 'sub',
  sub: 'sup'
}

export function toggleMark(editor, format) {
  const isActive = isMarkActive(editor, format)

  if (isActive) {
    Editor.removeMark(editor, format)
  } else {
    if (mutuallyExclusive[format] &&
        isMarkActive(editor, mutuallyExclusive[format])) {
      Editor.removeMark(editor, mutuallyExclusive[format]);
    }

    Editor.addMark(editor, format, true)
  }
}

export function isMarkActive(editor, format) {
  const marks = Editor.marks(editor)
  return marks ? marks[format] === true : false
}
