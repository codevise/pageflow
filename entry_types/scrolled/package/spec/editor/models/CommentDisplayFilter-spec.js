import {CommentDisplayFilter} from 'editor/models/CommentDisplayFilter';

describe('CommentDisplayFilter', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('shows unresolved threads by default', () => {
    const filter = new CommentDisplayFilter();

    expect(filter.get('resolution')).toEqual('unresolved');
    expect(filter.showsResolved()).toBe(false);
  });

  it('remembers the resolution across editor sessions', () => {
    new CommentDisplayFilter().set('resolution', 'all');

    const filter = new CommentDisplayFilter();

    expect(filter.get('resolution')).toEqual('all');
    expect(filter.showsResolved()).toBe(true);
  });

  it('remembers going back to unresolved threads', () => {
    new CommentDisplayFilter().set('resolution', 'all');
    new CommentDisplayFilter().set('resolution', 'unresolved');

    expect(new CommentDisplayFilter().get('resolution')).toEqual('unresolved');
  });

  it('does not inherit the resolution of the published entry preview', () => {
    window.localStorage['pageflow.scrolled.commentsResolution'] = 'all';

    expect(new CommentDisplayFilter().get('resolution')).toEqual('unresolved');
  });
});
