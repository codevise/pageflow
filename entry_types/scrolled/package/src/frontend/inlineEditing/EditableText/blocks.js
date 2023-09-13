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
      ...preserveColorAndTypograpyhVariant(editor)
    };

    Transforms.wrapNodes(editor, block);
  }
}

export function applyTypograpyhVariant(editor, variant) {
  applyProperties(editor, {variant});
}

export function applyColor(editor, color) {
  applyProperties(editor, {color});
}

function applyProperties(editor, properties) {
  Transforms.setNodes(editor, properties, {mode: 'highest'});
  applyPropertiesToListItems(editor, properties);
}

function applyPropertiesToListItems(editor, properties) {
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
        properties,
        {at: itemPath}
      )
    }
  }
}

function preserveColorAndTypograpyhVariant(editor) {
  const nodeEntry = Editor.above(editor, {
    at: Range.start(editor.selection),
    match: n => !!n.type
  });

  const result = {};

  if (nodeEntry && nodeEntry[0].variant) {
    result.variant = nodeEntry[0].variant;
  }

  if (nodeEntry && nodeEntry[0].color) {
    result.color = nodeEntry[0].color;
  }

  return result;
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
