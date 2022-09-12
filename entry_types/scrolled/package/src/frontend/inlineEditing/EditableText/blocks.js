import {Editor, Element, Node, Transforms, Range} from 'slate';

export function isBlockActive(editor, format) {
  const [match] = Editor.nodes(editor, {
    match: n => n.type === format,
  });

  return !!match;
}

const listTypes = ['numbered-list', 'bulleted-list'];

export function toggleBlock(editor, format) {
  const isActive = isBlockActive(editor, format);
  const isList = listTypes.includes(format);

  Transforms.unwrapNodes(editor, {
    match: n => listTypes.includes(n.type),
    split: true,
  });

  Transforms.setNodes(editor, {
    type: isActive ? 'paragraph' : isList ? 'list-item' : format,
  });

  if (!isActive && isList) {
    const block = {
      type: format,
      children: [],
      ...preserveTypograpyhVariant(editor)
    };

    Transforms.wrapNodes(editor, block);
  }
}

export function applyTypograpyhVariant(editor, variant) {
  Transforms.setNodes(editor, {variant}, {mode: 'highest'});
  applyTypograpyhVariantToListItems(editor, variant);
}

function applyTypograpyhVariantToListItems(editor, variant) {
  const lists = Editor.nodes(editor, {
    match: n => listTypes.includes(n.type)
  });

  for (const [, listPath] of lists) {
    const items = Editor.nodes(editor, {
      at: listPath,
      match: n => n.type === 'list-item'
    });

    for (const [, itemPath] of items) {
      Transforms.setNodes(
        editor,
        {variant: variant},
        {at: itemPath}
      )
    }
  }
}

function preserveTypograpyhVariant(editor) {
  const nodeEntry = Editor.above(editor, {
    at: Range.start(editor.selection),
    match: n => !!n.type
  });

  return nodeEntry && nodeEntry[0].variant ?
         {variant: nodeEntry[0].variant} :
         {};
}

export function withBlockNormalization({onlyParagraphs}, editor) {
  if (!onlyParagraphs) {
    return editor;
  }

  const { normalizeNode } = editor;

  editor.normalizeNode = ([node, path]) => {
    if (path.length === 0) {
      for (const [child, childPath] of Node.children(editor, path)) {
        if (Element.isElement(child) && child.type !== 'paragraph') {
          Transforms.unwrapNodes(editor, {
            match: n => listTypes.includes(n.type),
            split: true,
            at: childPath
          });

          Transforms.setNodes(editor, {type: 'paragraph'}, {at: childPath});
        }
      }
    }

    return normalizeNode([node, path]);
  };

  return editor;
}
