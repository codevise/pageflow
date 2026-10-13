import 'contentElements/logoList/editor';

import {useEditorGlobals} from 'support';

describe('logoList editor path', () => {
  const {createEntry} = useEditorGlobals();

  function create() {
    const entry = createEntry({
      contentElements: [{id: 5, typeName: 'logoList',
                         configuration: {items: [{id: 7}]}}]
    });

    return entry.contentElements.get(5);
  }

  it('leads to item selected in preview', () => {
    const contentElement = create();

    contentElement.transientState.set({selectedItemId: 7});

    expect(contentElement.getEditorPath()).toEqual('/scrolled/logoLists/5/7');
  });

  it('leads to content element if no item is selected', () => {
    const contentElement = create();

    expect(contentElement.getEditorPath()).toEqual('/scrolled/content_elements/5');
  });
});
