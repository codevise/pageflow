/** @jsx jsx */
import {
  getActiveLink,
  applyLink
} from 'frontend/inlineEditing/EditableText/links';
import {withLinks} from 'frontend/inlineEditing/EditableText/withLinks';

import {createHyperscript} from 'slate-hyperscript';

const h = createHyperscript({
  elements: {
    paragraph: {type: 'paragraph'},
    link: {type: 'link'}
  },
});

const jsx = (tagName, attributes, ...children) => {
  delete attributes.__self;
  delete attributes.__source;
  return h(tagName, attributes, ...children);
}

describe('getActiveLink', () => {
  it('returns href and openInNewTab of link at selection', () => {
    const editor = withLinks(
      <editor>
        <paragraph>
          Some <link href={{chapter: 10}} openInNewTab>li<cursor />nk</link>
        </paragraph>
      </editor>
    );

    expect(getActiveLink(editor)).toEqual({href: {chapter: 10}, openInNewTab: true});
  });

  it('returns null if selection is not inside link', () => {
    const editor = withLinks(
      <editor>
        <paragraph>
          Some <cursor />text
        </paragraph>
      </editor>
    );

    expect(getActiveLink(editor)).toBeNull();
  });
});

describe('applyLink', () => {
  it('wraps selection in link', () => {
    const editor = withLinks(
      <editor>
        <paragraph>
          Some <anchor />text<focus />
        </paragraph>
      </editor>
    );

    applyLink(editor, {href: 'https://example.com', openInNewTab: true});

    expect(editor.children).toEqual([
      {
        type: 'paragraph',
        children: [
          {text: 'Some '},
          {
            type: 'link',
            href: 'https://example.com',
            openInNewTab: true,
            children: [{text: 'text'}]
          },
          {text: ''}
        ]
      }
    ]);
  });

  it('updates link at selection', () => {
    const editor = withLinks(
      <editor>
        <paragraph>
          <text />
          <link href="https://example.com" openInNewTab>li<cursor />nk</link>
          <text />
        </paragraph>
      </editor>
    );

    applyLink(editor, {href: {chapter: 10}});

    expect(editor.children[0].children[1]).toEqual({
      type: 'link',
      href: {chapter: 10},
      children: [{text: 'link'}]
    });
  });

  it('removes link at selection if link is null', () => {
    const editor = withLinks(
      <editor>
        <paragraph>
          <text />
          <link href="https://example.com">li<cursor />nk</link>
          <text />
        </paragraph>
      </editor>
    );

    applyLink(editor, null);

    expect(editor.children).toEqual([
      {type: 'paragraph', children: [{text: 'link'}]}
    ]);
  });
});
