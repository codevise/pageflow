import 'contentElements/editor';
import {editor} from 'editor';

describe('contentElements/editor', () => {
  it('registers content elements in editor api', () => {
    expect(editor.contentElementTypes.toArray().length).toBeGreaterThan(0);
  });
});
