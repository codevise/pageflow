import {Text, Transforms} from 'slate';

export const shy = '\u00AD';

export function decorateCharacter([node, path], character, attributes, {length}) {
  if (Text.isText(node)) {
    const parts = node.text.split(character);
    parts.pop();

    let i = 0;

    return parts.map(part => {
      i += part.length + 1;

      return {
        anchor: {path, offset: i - 1},
        focus: {path, offset: i - 1 + length},
        ...attributes
      };
    });
  }

  return [];
}

export function deleteCharacter(editor, node, path, regExp, offset = 0) {
  const match = regExp.exec(node.text);

  if (match) {
    Transforms.delete(editor, {
      at: {path, offset: match.index + offset},
      distance: 1,
      unit: 'character'
    });

    return true;
  }

  return false
}
