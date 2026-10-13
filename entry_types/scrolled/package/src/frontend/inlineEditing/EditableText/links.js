import {Editor, Transforms} from 'slate';

export function getActiveLink(editor) {
  const [entry] = Editor.nodes(editor, {match: isLink});

  if (!entry) {
    return null;
  }

  const [link] = entry;
  return {href: link.href, openInNewTab: link.openInNewTab};
}

export function applyLink(editor, link) {
  if (!link) {
    Transforms.unwrapNodes(editor, {match: isLink});
  }
  else if (getActiveLink(editor)) {
    Transforms.unsetNodes(editor, 'openInNewTab', {match: isLink});
    Transforms.setNodes(editor, linkAttributes(link), {match: isLink});
  }
  else {
    Transforms.wrapNodes(editor,
                         {type: 'link', ...linkAttributes(link), children: []},
                         {split: true});
    Transforms.collapse(editor, {edge: 'end'});
  }
}

function linkAttributes({href, openInNewTab}) {
  return openInNewTab ? {href, openInNewTab} : {href};
}

function isLink(node) {
  return node.type === 'link';
}
