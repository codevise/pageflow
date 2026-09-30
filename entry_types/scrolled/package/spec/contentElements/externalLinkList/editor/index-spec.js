import {editor} from 'pageflow-scrolled/editor';

import 'contentElements/externalLinkList/editor';

describe('externalLinkList/editor', () => {
  it('starts with two empty cards', () => {
    const type = editor.contentElementTypes.findByTypeName('externalLinkList');

    expect(type.defaultConfig).toEqual({
      thumbnailAspectRatio: 'square',
      links: [{id: 1}, {id: 2}]
    });
  });
});
