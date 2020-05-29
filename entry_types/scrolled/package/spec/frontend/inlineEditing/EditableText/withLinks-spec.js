import {decorateLinkSelection} from 'frontend/inlineEditing/EditableText/withLinks';

describe('decorateLinkSelection', () => {
  it('returns range for node containing link selection', () => {
    const node = {text: 'text link text'}
    const path = [1, 2];
    const linkSelection = {
      anchor: {path: [1, 2], offset: 5},
      focus: {path: [1, 2], offset: 9}
    };

    const ranges = decorateLinkSelection([node, path], linkSelection);

    expect(ranges).toMatchObject([linkSelection]);
  });

  it('returns empty array for non intersecting node', () => {
    const node = {text: 'text link text'}
    const path = [1, 1];
    const linkSelection = {
      anchor: {path: [1, 2], offset: 5},
      focus: {path: [1, 2], offset: 9}
    };

    const ranges = decorateLinkSelection([node, path], linkSelection);

    expect(ranges).toMatchObject([]);
  });

  it('returns range for node containing start of link selection', () => {
    const node = {text: 'text link'}
    const path = [1, 2];
    const linkSelection = {
      anchor: {path: [1, 2], offset: 5},
      focus: {path: [1, 3], offset: 9}
    };

    const ranges = decorateLinkSelection([node, path], linkSelection);

    expect(ranges).toMatchObject([{
      anchor: {path: [1, 2], offset: 5},
      focus: {path: [1, 2], offset: 9}
    }]);
  });

  it('returns range for node containing end of link selection', () => {
    const node = {text: 'link text'}
    const path = [1, 3];
    const linkSelection = {
      anchor: {path: [1, 2], offset: 5},
      focus: {path: [1, 3], offset: 4}
    };

    const ranges = decorateLinkSelection([node, path], linkSelection);

    expect(ranges).toMatchObject([{
      anchor: {path: [1, 3], offset: 0},
      focus: {path: [1, 3], offset: 4}
    }]);
  });

  it('returns range for node contained in link selection', () => {
    const node = {text: 'text'}
    const path = [1, 2];
    const linkSelection = {
      anchor: {path: [1, 1], offset: 5},
      focus: {path: [1, 3], offset: 4}
    };

    const ranges = decorateLinkSelection([node, path], linkSelection);

    expect(ranges).toMatchObject([{
      anchor: {path: [1, 2], offset: 0},
      focus: {path: [1, 2], offset: 4}
    }]);
  });
});
